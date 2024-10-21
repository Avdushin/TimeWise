use chrono::Local;
use std::env;
use std::fs;
use std::process::Command;
use std::fs::File as StdFile;
use std::io::Result;
use zip::write::FileOptions;
use std::fs::OpenOptions;

use crate::telegram::send_backup_to_telegram;
use anyhow::{Context, Result as AnyhowResult};

// Создаёт архив старых бэкапов, если количество архивов превышает 2, удаляет старые
fn archive_old_backups(backup_dir: &str) -> Result<()> {
    let mut archives = fs::read_dir(backup_dir)?
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.path().extension().map_or(false, |ext| ext == "zip"))
        .collect::<Vec<_>>();

    archives.sort_by_key(|entry| fs::metadata(entry.path()).unwrap().modified().unwrap());

    // Удаляем старые архивы, оставляя максимум 2
    if archives.len() > 2 {
        for archive in archives.iter().take(archives.len() - 2) {
            fs::remove_file(archive.path())?;
        }
    }

    // Создание архива
    let zip_file = format!("{}backup_{}.zip", backup_dir, Local::now().format("%d-%m-%Y-%H-%M-%S"));
    let file = StdFile::create(&zip_file)?;
    let mut zip = zip::ZipWriter::new(file);

    let mut sql_files = fs::read_dir(backup_dir)?
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.path().extension().map_or(false, |ext| ext == "sql"))
        .collect::<Vec<_>>();

    // Удаляем все .sql файлы, кроме одного, который оставляем
    if sql_files.len() > 1 {
        let last_sql_file = sql_files.pop().unwrap();
        for sql_file in sql_files {
            fs::remove_file(sql_file.path())?;
        }
        
        // Добавляем оставшийся файл в архив
        let mut backup_file = OpenOptions::new().read(true).open(last_sql_file.path())?;
        let options = FileOptions::default().compression_method(zip::CompressionMethod::Stored);
        zip.start_file(last_sql_file.file_name().to_string_lossy(), options)?;
        std::io::copy(&mut backup_file, &mut zip)?;
    }

    zip.finish()?;
    println!("Создан архив: {zip_file}");
    Ok(())
}

// db backup
pub async fn backup_database() -> AnyhowResult<()> {
    let pg_dump_path_windows = match cfg!(target_os = "windows") {
        true => env::var("PG_DUMP_PATH_WINDOWS_WINDOWS").expect("PG_DUMP_PATH_WINDOWS_WINDOWS must be set"),
        false => "pg_dump".to_string(),
    };    

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let backup_dir = "backups/";
    fs::create_dir_all(backup_dir)?;

    let current_time = Local::now().format("%d-%m-%Y-%H-%M-%S").to_string();
    let backup_file = format!("{backup_dir}{current_time}.sql");

    let output = Command::new(pg_dump_path_windows)
        .arg(&database_url)
        .arg("-f")
        .arg(&backup_file)
        .output()?;

    if output.status.success() {
        println!("Backup создан: {backup_file}");
        archive_old_backups(backup_dir).context("Ошибка при архивировании старых бэкапов")?;
        send_backup_to_telegram(backup_file).await.context("Ошибка при отправке бэкапа в Telegram")?;
    } else {
        eprintln!("Ошибка при создании бэкапа: {:?}", output.stderr);
    }

    Ok(())
}
