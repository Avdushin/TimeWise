use actix_web::dev::Payload;
use actix_web::error::ErrorBadRequest;
use actix_web::error::ErrorUnauthorized;
use actix_web::FromRequest;
use actix_web::{web, Error, HttpRequest, HttpResponse, Responder};
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use futures::future::{ready, Ready};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use log::error;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;
use uuid::Uuid;

// Структуры для регистрации и логина
#[derive(Deserialize)]
pub struct RegisterData {
    pub username: String,
    pub email: String,
    pub password: String,
    pub birthdate: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub middle_name: Option<String>,
    pub country: Option<String>,
    pub city: Option<String>,
    pub phone: Option<String>,
}

#[derive(Deserialize)]
pub struct LoginData {
    pub email: String,
    pub password: String,
}

// Ответ с данными пользователя
#[derive(Serialize, Deserialize)]
struct UserResponse {
    id: Uuid,
    username: String,
    email: String,
    birthdate: String,
    first_name: Option<String>,
    last_name: Option<String>,
    middle_name: Option<String>,
    country: Option<String>,
    city: Option<String>,
    phone: Option<String>,
}

// JWT Claims структура
#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub birthdate: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub middle_name: Option<String>,
    pub country: Option<String>,
    pub city: Option<String>,
    pub phone: Option<String>,
    pub exp: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub birthdate: String,
    pub password_hash: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub middle_name: Option<String>,
    pub country: Option<String>,
    pub city: Option<String>,
    pub phone: Option<String>,
}


// Функция регистрации пользователя
pub async fn register_user(
    pool: web::Data<PgPool>,
    form: web::Json<RegisterData>,
) -> Result<impl Responder, actix_web::Error> {
    let password_hash = hash(&form.password, DEFAULT_COST)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Error hashing password"))?; // Используем ErrorInternalServerError

    let user = sqlx::query_as!(
        UserResponse,
        "INSERT INTO users (username, email, password_hash, birthdate, first_name, last_name, middle_name, country, city, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, username, email, birthdate, first_name, last_name, middle_name, country, city, phone",
        form.username,
        form.email,
        password_hash,
        form.birthdate,
        form.first_name,
        form.last_name,
        form.middle_name,
        form.country,
        form.city,
        form.phone
    )
    .fetch_one(pool.get_ref())
    .await;

    match user {
        Ok(user) => Ok(HttpResponse::Ok().json(user)),
        Err(e) => Err(actix_web::error::ErrorBadRequest(format!(
            "Error creating user: {}",
            e
        ))), // Возвращаем ошибку
    }
}

// Функция входа пользователя
pub async fn login_user(
    pool: web::Data<PgPool>,
    login_data: web::Json<LoginData>,
) -> Result<HttpResponse, Error> {
    // Проверка существования пользователя по email
    let user = sqlx::query!(
        "SELECT * FROM users WHERE email = $1",
        login_data.email
    )
    .fetch_one(pool.get_ref())
    .await
    .map_err(|_| ErrorUnauthorized("Неверный логин или пароль"))?;

    // Проверка пароля
    let is_valid = verify(&login_data.password, &user.password_hash)
        .map_err(|_| ErrorUnauthorized("Неверный логин или пароль"))?;

    if !is_valid {
        return Err(ErrorUnauthorized("Неверный логин или пароль"));
    }

    // Создание токена JWT
    let secret_key = env::var("JWT_SECRET").expect("JWT_SECRET не найден");
    let expiration = Utc::now() + Duration::hours(24); // Установим срок действия токена на 24 часа

    let claims = Claims {
        id: user.id,
        username: user.username.clone(),
        email: user.email.clone(),
        birthdate: user.birthdate.clone(),
        first_name: user.first_name.clone(),
        last_name: user.last_name.clone(),
        middle_name: user.middle_name.clone(),
        country: user.country.clone(),
        city: user.city.clone(),
        phone: user.phone.clone(),
        exp: expiration.timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret_key.as_ref()),
    )
    .map_err(|_| ErrorUnauthorized("Не удалось создать токен"))?;

    // Отправляем токен и полные данные claims в ответе
    Ok(HttpResponse::Ok().json(serde_json::json!({ 
        "token": token,
        "claims": claims
    })))
}

// Структура для пользователя, авторизованного по токену
pub struct AuthUser(pub Claims);

impl FromRequest for AuthUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut Payload) -> Self::Future {
        if let Some(auth_header) = req.headers().get("Authorization") {
            if let Ok(auth_str) = auth_header.to_str() {
                if auth_str.starts_with("Bearer ") {
                    let token = auth_str.trim_start_matches("Bearer ");
                    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

                    match decode::<Claims>(
                        token,
                        &DecodingKey::from_secret(jwt_secret.as_ref()),
                        &Validation::new(Algorithm::HS256),
                    ) {
                        Ok(token_data) => return ready(Ok(AuthUser(token_data.claims))),
                        Err(err) => {
                            log::error!("Token decode error: {:?}", err);
                            return ready(Err(ErrorUnauthorized("Invalid or expired token")));
                        }
                    }
                }
            }
        }
        ready(Err(ErrorUnauthorized(
            "Authorization header missing or malformed",
        )))
    }
}

// Проверка аутентификации и возврат данных пользователя
pub async fn check_auth(req: HttpRequest) -> Result<HttpResponse, Error> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .ok_or_else(|| ErrorUnauthorized("Missing Authorization header"))?
        .to_str()
        .map_err(|_| ErrorUnauthorized("Invalid Authorization header"))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| ErrorUnauthorized("Invalid token format"))?;

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let token_data = decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| ErrorUnauthorized("Invalid token"))?;

    Ok(HttpResponse::Ok().json(token_data.claims))
}