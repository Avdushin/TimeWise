use actix_web::{web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use jsonwebtoken::{decode, Validation, DecodingKey};
use std::env;

#[derive(Deserialize)]
pub struct EventData {
    pub title: String,
    pub date: String,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
}

#[derive(Serialize)]
struct EventResponse {
    id: Uuid,
    title: String,
    date: String,
    description: Option<String>,
    tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
struct Claims {
    id: Uuid,
}

// POST /events
pub async fn create_event(
    pool: web::Data<PgPool>,
    form: web::Json<EventData>,
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
                        EventResponse,
                        "INSERT INTO events (user_id, title, date, description, tags) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, date, description, tags",
                        user_id,
                        form.title,
                        form.date,
                        form.description,
                        form.tags.as_deref()
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match record {
                        Ok(event) => HttpResponse::Ok().json(event),
                        Err(err) => {
                            eprintln!("Failed to create event: {}", err);
                            HttpResponse::InternalServerError().body("Failed to create event")
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

// GET /events
pub async fn get_events(
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
                    let events = sqlx::query_as!(
                        EventResponse,
                        "SELECT id, title, date, description, tags FROM events WHERE user_id = $1",
                        user_id
                    )
                    .fetch_all(pool.get_ref())
                    .await;
                    match events {
                        Ok(events) => HttpResponse::Ok().json(events),
                        Err(err) => {
                            eprintln!("Failed to fetch events: {}", err);
                            HttpResponse::InternalServerError().body("Failed to fetch events")
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

// GET /events/{id}
pub async fn get_event(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    event_id: web::Path<Uuid>,
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
                    let event_id = event_id.into_inner();
                    let event = sqlx::query_as!(
                        EventResponse,
                        "SELECT id, title, date, description, tags FROM events WHERE user_id = $1 AND id = $2",
                        user_id,
                        event_id
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match event {
                        Ok(event) => HttpResponse::Ok().json(event),
                        Err(err) => {
                            eprintln!("Failed to fetch event: {}", err);
                            HttpResponse::NotFound().body("Event not found")
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

// PUT /events/{id}
pub async fn update_event(
    pool: web::Data<PgPool>,
    form: web::Json<EventData>,
    req: HttpRequest,
    event_id: web::Path<Uuid>,
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
                    let event_id = event_id.into_inner();
                    let event = sqlx::query_as!(
                        EventResponse,
                        "UPDATE events SET title = $1, date = $2, description = $3, tags = $4 WHERE user_id = $5 AND id = $6 RETURNING id, title, date, description, tags",
                        form.title,
                        form.date,
                        form.description,
                        form.tags.as_deref(),
                        user_id,
                        event_id
                    )
                    .fetch_one(pool.get_ref())
                    .await;
                    match event {
                        Ok(event) => HttpResponse::Ok().json(event),
                        Err(err) => {
                            eprintln!("Failed to update event: {}", err);
                            HttpResponse::InternalServerError().body("Failed to update event")
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

// DELETE /events/{id}
pub async fn delete_event(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    event_id: web::Path<Uuid>,
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
                    let event_id = event_id.into_inner();
                    let result = sqlx::query!(
                        "DELETE FROM events WHERE user_id = $1 AND id = $2",
                        user_id,
                        event_id
                    )
                    .execute(pool.get_ref())
                    .await;
                    match result {
                        Ok(_) => HttpResponse::Ok().body("Event deleted successfully"),
                        Err(err) => {
                            eprintln!("Failed to delete event: {}", err);
                            HttpResponse::InternalServerError().body("Failed to delete event")
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
