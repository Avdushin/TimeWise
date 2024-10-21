use actix_web::{web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use jsonwebtoken::{decode, Validation, DecodingKey};
use std::env;

#[derive(Deserialize)]
pub struct TaskData {
    pub title: String,
    pub description: Option<String>,
    pub due_date: Option<String>,
}

#[derive(Serialize)]
struct TaskResponse {
    id: Uuid,
    title: String,
    description: Option<String>,
    due_date: Option<String>,
}

#[derive(Debug, Deserialize)]
struct Claims {
    id: Uuid,
}

// POST /tasks
pub async fn create_task(
    pool: web::Data<PgPool>,
    form: web::Json<TaskData>,
    req: HttpRequest,
) -> impl Responder {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            let token = &auth_header[7..];
            match decode::<Claims>(
                token,
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::default(),
            ) {
                Ok(token_data) => {
                    let user_id = token_data.claims.id;
                    let record = sqlx::query_as!(
                        TaskResponse,
                        "INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING id, title, description, due_date",
                        user_id,
                        form.title,
                        form.description,
                        form.due_date
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match record {
                        Ok(task) => HttpResponse::Ok().json(task),
                        Err(err) => {
                            eprintln!("Failed to create task: {}", err);
                            HttpResponse::InternalServerError().body("Failed to create task")
                        }
                    }
                },
                Err(err) => {
                    eprintln!("Invalid token: {}", err);
                    HttpResponse::Unauthorized().body("Invalid token")
                }
            }
        } else {
            HttpResponse::Unauthorized().body("Invalid authorization header")
        }
    } else {
        HttpResponse::Unauthorized().body("Missing authorization header")
    }
}

// GET /tasks
pub async fn get_tasks(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> impl Responder {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            let token = &auth_header[7..];
            match decode::<Claims>(
                token,
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::default(),
            ) {
                Ok(token_data) => {
                    let user_id = token_data.claims.id;
                    let tasks = sqlx::query_as!(
                        TaskResponse,
                        "SELECT id, title, description, due_date FROM tasks WHERE user_id = $1",
                        user_id
                    )
                    .fetch_all(pool.get_ref())
                    .await;
                    match tasks {
                        Ok(tasks) => HttpResponse::Ok().json(tasks),
                        Err(err) => {
                            eprintln!("Failed to fetch tasks: {}", err);
                            HttpResponse::InternalServerError().body("Failed to fetch tasks")
                        }
                    }
                },
                Err(err) => {
                    eprintln!("Invalid token: {}", err);
                    HttpResponse::Unauthorized().body("Invalid token")
                }
            }
        } else {
            HttpResponse::Unauthorized().body("Invalid authorization header")
        }
    } else {
        HttpResponse::Unauthorized().body("Missing authorization header")
    }
}

// GET /tasks/{id}
pub async fn get_task(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    task_id: web::Path<Uuid>,
) -> impl Responder {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            let token = &auth_header[7..];
            match decode::<Claims>(
                token,
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::default(),
            ) {
                Ok(token_data) => {
                    let user_id = token_data.claims.id;
                    let task_id = task_id.into_inner();
                    let task = sqlx::query_as!(
                        TaskResponse,
                        "SELECT id, title, description, due_date FROM tasks WHERE user_id = $1 AND id = $2",
                        user_id,
                        task_id
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match task {
                        Ok(task) => HttpResponse::Ok().json(task),
                        Err(err) => {
                            eprintln!("Failed to fetch task: {}", err);
                            HttpResponse::NotFound().body("Task not found")
                        }
                    }
                },
                Err(err) => {
                    eprintln!("Invalid token: {}", err);
                    HttpResponse::Unauthorized().body("Invalid token")
                }
            }
        } else {
            HttpResponse::Unauthorized().body("Invalid authorization header")
        }
    } else {
        HttpResponse::Unauthorized().body("Missing authorization header")
    }
}

// PUT /tasks/{id}
pub async fn update_task(
    pool: web::Data<PgPool>,
    form: web::Json<TaskData>,
    req: HttpRequest,
    task_id: web::Path<Uuid>,
) -> impl Responder {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            let token = &auth_header[7..];
            match decode::<Claims>(
                token,
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::default(),
            ) {
                Ok(token_data) => {
                    let user_id = token_data.claims.id;
                    let task_id = task_id.into_inner();
                    let task = sqlx::query_as!(
                        TaskResponse,
                        "UPDATE tasks SET title = $1, description = $2, due_date = $3 WHERE user_id = $4 AND id = $5 RETURNING id, title, description, due_date",
                        form.title,
                        form.description,
                        form.due_date,
                        user_id,
                        task_id
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match task {
                        Ok(task) => HttpResponse::Ok().json(task),
                        Err(err) => {
                            eprintln!("Failed to update task: {}", err);
                            HttpResponse::InternalServerError().body("Failed to update task")
                        }
                    }
                },
                Err(err) => {
                    eprintln!("Invalid token: {}", err);
                    HttpResponse::Unauthorized().body("Invalid token")
                }
            }
        } else {
            HttpResponse::Unauthorized().body("Invalid authorization header")
        }
    } else {
        HttpResponse::Unauthorized().body("Missing authorization header")
    }
}

// DELETE /tasks/{id}
pub async fn delete_task(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    task_id: web::Path<Uuid>,
) -> impl Responder {
    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            let token = &auth_header[7..];
            match decode::<Claims>(
                token,
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::default(),
            ) {
                Ok(token_data) => {
                    let user_id = token_data.claims.id;
                    let task_id = task_id.into_inner();
                    let result = sqlx::query!(
                        "DELETE FROM tasks WHERE user_id = $1 AND id = $2",
                        user_id,
                        task_id
                    )
                    .execute(pool.get_ref())
                    .await;
                    match result {
                        Ok(_) => HttpResponse::Ok().body("Task deleted successfully"),
                        Err(err) => {
                            eprintln!("Failed to delete task: {}", err);
                            HttpResponse::InternalServerError().body("Failed to delete task")
                        }
                    }
                },
                Err(err) => {
                    eprintln!("Invalid token: {}", err);
                    HttpResponse::Unauthorized().body("Invalid token")
                }
            }
        } else {
            HttpResponse::Unauthorized().body("Invalid authorization header")
        }
    } else {
        HttpResponse::Unauthorized().body("Missing authorization header")
    }
}
