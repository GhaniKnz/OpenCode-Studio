mod commands;
mod types;

use commands::workspace::{get_project_files, read_file_content, select_folder};
use commands::process::{run_opencode, check_executable, get_app_version};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_project_files,
            read_file_content,
            select_folder,
            run_opencode,
            check_executable,
            get_app_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
