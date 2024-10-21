use actix_web::{App, HttpServer, middleware};
use actix_web::web::Data;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use sqlx::PgPool;
use std::env;

use crate::cors::configure_cors;

pub async fn run_server(pool: PgPool, server_address: &str) -> std::io::Result<()> {
    let app_mode = env::var("APP_MODE").unwrap_or_else(|_| "dev".to_string());

    let server = HttpServer::new(move || {
        let cors = configure_cors();

        App::new()
            .app_data(Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(crate::routes::config_routes)
    });

    match app_mode.as_str() {
        "release" => {
            let private_key_file = env::var("PRIVATE_KEY_PATH").expect("PRIVATE_KEY_PATH must be set");
            let certificate_file = env::var("CERTIFICATE_PATH").expect("CERTIFICATE_PATH must be set");

            let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
            builder.set_private_key_file(private_key_file, SslFiletype::PEM).unwrap();
            builder.set_certificate_chain_file(certificate_file).unwrap();

            server
                .bind_openssl(server_address, builder)?
                .run()
                .await
        },
        _ => {
            server
                .bind(server_address)?
                .run()
                .await
        }
    }
}
