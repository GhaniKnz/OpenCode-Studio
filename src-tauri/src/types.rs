use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub node_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
    #[serde(rename = "recentlyModified")]
    pub recently_modified: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extension: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResult {
    pub stdout: String,
    pub stderr: String,
    #[serde(rename = "exitCode")]
    pub exit_code: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LogEvent {
    pub level: String,
    pub message: String,
    pub source: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    #[serde(rename = "opencodeExecutablePath")]
    pub opencode_executable_path: String,
    #[serde(rename = "recentProjects")]
    pub recent_projects: Vec<RecentProject>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RecentProject {
    pub id: String,
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub project_type: String,
    #[serde(rename = "lastOpened")]
    pub last_opened: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        AppConfig {
            opencode_executable_path: "opencode".to_string(),
            recent_projects: vec![],
        }
    }
}
