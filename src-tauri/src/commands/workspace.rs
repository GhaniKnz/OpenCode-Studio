use std::path::Path;
use crate::types::FileNode;

/// Walk directory and return a tree of FileNodes.
/// Excludes common noise directories (node_modules, .git, target, etc.)
#[tauri::command]
pub fn get_project_files(project_path: String) -> Result<FileNode, String> {
    let path = Path::new(&project_path);
    if !path.exists() {
        return Err(format!("Path does not exist: {}", project_path));
    }
    build_tree(path, 0).ok_or_else(|| "Failed to read directory".to_string())
}

fn build_tree(path: &Path, depth: u32) -> Option<FileNode> {
    if depth > 5 {
        return None;
    }

    let name = path.file_name()?.to_string_lossy().to_string();
    let path_str = path.to_string_lossy().to_string();

    // Skip common noise directories
    let skip_dirs = [
        "node_modules",
        ".git",
        "target",
        ".next",
        "dist",
        "build",
        ".cache",
        "__pycache__",
        ".idea",
        ".vscode",
        "Temp",
        "Library",
    ];
    if skip_dirs.contains(&name.as_str()) {
        return None;
    }

    if path.is_file() {
        let ext = path
            .extension()
            .map(|e| e.to_string_lossy().to_lowercase());

        // Check if recently modified (within last hour)
        let recently_modified = path
            .metadata()
            .and_then(|m| m.modified())
            .map(|t| t.elapsed().map(|d| d.as_secs() < 3600).unwrap_or(false))
            .unwrap_or(false);

        return Some(FileNode {
            name,
            path: path_str,
            node_type: "file".to_string(),
            children: None,
            recently_modified,
            extension: ext.map(|e| e.to_string()),
        });
    }

    if path.is_dir() {
        let mut children: Vec<FileNode> = match std::fs::read_dir(path) {
            Ok(entries) => entries
                .filter_map(|e| e.ok())
                .filter_map(|e| build_tree(&e.path(), depth + 1))
                .collect(),
            Err(_) => vec![],
        };

        // Sort: directories first, then files, both alphabetically
        children.sort_by(|a, b| match (&a.node_type[..], &b.node_type[..]) {
            ("directory", "file") => std::cmp::Ordering::Less,
            ("file", "directory") => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        });

        return Some(FileNode {
            name,
            path: path_str,
            node_type: "directory".to_string(),
            children: Some(children),
            recently_modified: false,
            extension: None,
        });
    }

    None
}

/// Read file content (text files only, max 1MB)
#[tauri::command]
pub fn read_file_content(file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }
    if !path.is_file() {
        return Err(format!("Not a file: {}", file_path));
    }

    let metadata = path.metadata().map_err(|e| e.to_string())?;
    if metadata.len() > 1_000_000 {
        return Err("File too large to display (> 1MB)".to_string());
    }

    std::fs::read_to_string(path).map_err(|e| format!("Failed to read file: {}", e))
}

/// Open a folder picker dialog
#[tauri::command]
pub async fn select_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let path = app.dialog().file().pick_folder().blocking_pick();

    Ok(path.map(|p| p.to_string_lossy().to_string()))
}
