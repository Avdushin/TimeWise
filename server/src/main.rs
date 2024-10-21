use actix_web;
use dotenv::dotenv;
use sqlx::PgPool;
use std::env;
use tokio::time::{interval, Duration};

mod auth;
mod tasks;
mod events;
mod routes;
mod server;
mod backup;
mod telegram; 
mod cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();
    let server_address = env::var("SERVER_ADDRESS").expect("SERVER_ADDRESS must be set");

    println!("Server run at the {server_address}");

    //@ Запуск сервера
    let server = server::run_server(pool.clone(), &server_address);

    //@ Периодическое создание бэкапа (каждые 4 часа)
    let backup_db = async {
        let mut interval = interval(Duration::from_secs(4 * 60 * 60));
        loop {
            interval.tick().await;
            if let Err(e) = backup::backup_database().await {
                eprintln!("Ошибка при создании бэкапа: {:?}", e);
            }
        }
    };

    tokio::join!(server, backup_db);

    Ok(())
}
