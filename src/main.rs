mod db;
mod error;
mod handlers;
mod models;

use axum::{
    routing::{get, post, put, delete},
    Router,
};
use sqlx::sqlite::SqlitePool;
use std::net::SocketAddr;
use tower_http::services::ServeDir;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone)]
pub struct AppState {
    db: SqlitePool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "order_bits=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:inventory.db".to_string());

    let pool = SqlitePool::connect(&database_url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    tracing::info!("Database connected and migrations executed");

    let app_state = AppState { db: pool };

    let app = Router::new()
        // API routes
        .route("/api/components", get(handlers::list_components))
        .route("/api/components", post(handlers::create_component))
        .route("/api/components/:id", get(handlers::get_component))
        .route("/api/components/:id", put(handlers::update_component))
        .route("/api/components/:id", delete(handlers::delete_component))
        .route("/api/components/search", get(handlers::search_components))
        .route("/api/categories", get(handlers::list_categories))
        // Frontend routes
        .route("/", get(handlers::index))
        .route("/components", get(handlers::components_page))
        .route("/components/new", get(handlers::new_component_page))
        .route("/components/:id/edit", get(handlers::edit_component_page))
        // Static files
        .nest_service("/static", ServeDir::new("static"))
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("Server listen on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}