use reqwest::multipart::{Form, Part};
use tokio::fs::File;
use std::env;
use anyhow::Result;

// Функция для отправки бэкапа в Telegram
pub async fn send_backup_to_telegram(file_path: String) -> Result<()> {
    let token = env::var("TELEGRAM_BOT_TOKEN").expect("TELEGRAM_BOT_TOKEN must be set");
    let chat_id = env::var("TELEGRAM_CHAT_ID").expect("TELEGRAM_CHAT_ID must be set");

    let client = reqwest::Client::new();
    
    let file = File::open(&file_path).await?;
    let file_part = Part::stream(file)
        .file_name(file_path.clone())
        .mime_str("application/octet-stream")?;

    let response = client
        .post(format!(
            "https://api.telegram.org/bot{}/sendDocument",
            token
        ))
        .multipart(Form::new().part("document", file_part)) 
        .query(&[("chat_id", &chat_id)])
        .send()
        .await?;

    if response.status().is_success() {
        println!("Бэкап отправлен в Telegram: {}", file_path.clone());
    } else {
        eprintln!("Ошибка при отправке бэкапа в Telegram: {:?}", response.text().await);
    }

    Ok(())
}
