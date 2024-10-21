use sqlx::{PgPool, migrate::Migrator};
use std::path::Path;

pub async fn init_db(pool: &PgPool) {
    let migrator = Migrator::new(Path::new("./migrations")).await.unwrap();
    migrator.run(pool).await.unwrap();
}
