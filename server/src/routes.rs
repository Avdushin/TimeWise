use actix_web::web;

use crate::auth;
use crate::tasks;
use crate::events;

pub fn config_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            // Authentification
            .route("/signup", web::post().to(auth::register_user))
            .route("/login", web::post().to(auth::login_user))
            .route("/user/auth", web::get().to(auth::check_auth))
            // Tasks
            .service(
                web::scope("/tasks")
                    .route("", web::post().to(tasks::create_task))
                    .route("", web::get().to(tasks::get_tasks))
                    .route("/{id}", web::get().to(tasks::get_task))
                    .route("/{id}", web::put().to(tasks::update_task))
                    .route("/{id}", web::delete().to(tasks::delete_task)),
            )
            // Events
            .service(
                web::scope("/events")
                    .route("", web::post().to(events::create_event))
                    .route("", web::get().to(events::get_events))
                    .route("/{id}", web::get().to(events::get_event))
                    .route("/{id}", web::put().to(events::update_event))
                    .route("/{id}", web::delete().to(events::delete_event)),
            ),
    );
}
