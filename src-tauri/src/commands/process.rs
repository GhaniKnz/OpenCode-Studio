use std::process::Stdio;
use tauri::Emitter;
use crate::types::{CommandResult, LogEvent};

/// Run opencode with a given prompt in the specified project directory.
/// Captures stdout/stderr and emits log events to the frontend.
///
/// NOTE: opencode currently does not support a simple one-shot CLI mode for
/// arbitrary prompts via stdin in all versions. If your version requires
/// interactive mode, you may need to adapt this command.
/// See README.md for details on opencode integration.
#[tauri::command]
pub async fn run_opencode(
    app: tauri::AppHandle,
    project_path: String,
    prompt: String,
    executable_path: String,
) -> Result<CommandResult, String> {
    // Emit start log
    let _ = app.emit(
        "process-log",
        LogEvent {
            level: "info".to_string(),
            message: format!("Starting opencode in: {}", project_path),
            source: Some("process".to_string()),
        },
    );

    let output = tokio::process::Command::new(&executable_path)
        .arg("run")
        .arg("--print")
        .arg(&prompt)
        .current_dir(&project_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .output()
        .await
        .map_err(|e| {
            format!(
                "Failed to execute '{}': {}. Is opencode installed? See README for setup.",
                executable_path, e
            )
        })?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let exit_code = output.status.code().unwrap_or(-1);

    // Emit completion log
    let _ = app.emit(
        "process-log",
        LogEvent {
            level: if exit_code == 0 {
                "info".to_string()
            } else {
                "error".to_string()
            },
            message: format!("Process exited with code {}", exit_code),
            source: Some("process".to_string()),
        },
    );

    if !stderr.is_empty() {
        let _ = app.emit(
            "process-log",
            LogEvent {
                level: "warning".to_string(),
                message: stderr.clone(),
                source: Some("stderr".to_string()),
            },
        );
    }

    Ok(CommandResult {
        stdout,
        stderr,
        exit_code,
    })
}

/// Check if an executable is available in PATH or at the given path
#[tauri::command]
pub async fn check_executable(executable_path: String) -> bool {
    tokio::process::Command::new(&executable_path)
        .arg("--version")
        .output()
        .await
        .map(|o| o.status.success())
        .unwrap_or(false)
}

/// Get app version
#[tauri::command]
pub fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
