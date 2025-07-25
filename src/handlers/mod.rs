use crate::{
    db,
    error::AppError,
    models::{ComponentFilter, CreateComponent, UpdateComponent},
    AppState,
};
use askama::Template;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse, Json},
};

// Templates
#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate;

#[derive(Template)]
#[template(path = "components.html")]
struct ComponentsTemplate {
    components: Vec<crate::models::Component>,
    categories: Vec<crate::models::Category>,
}

#[derive(Template)]
#[template(path = "component_form.html")]
struct ComponentFormTemplate {
    component: Option<crate::models::Component>,
    categories: Vec<&'static str>,
    packages: Vec<&'static str>,
}

// Handlers per le pagine HTML
pub async fn index() -> impl IntoResponse {
    Html(IndexTemplate.render().unwrap())
}

pub async fn components_page(State(state): State<AppState>) -> Result<impl IntoResponse, AppError> {
    let components = db::get_all_components(&state.db).await?;
    let categories = db::get_categories(&state.db).await?;

    let template = ComponentsTemplate {
        components,
        categories,
    };

    Ok(Html(template.render()?))
}

pub async fn new_component_page() -> Result<impl IntoResponse, AppError> {
    let template = ComponentFormTemplate {
        component: None,
        categories: Vec::from(crate::models::DEFAULT_CATEGORIES),
        packages: Vec::from(crate::models::COMMON_PACKAGES),
    };

    Ok(Html(template.render()?))
}

pub async fn edit_component_page(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, AppError> {
    let component = db::get_component_by_id(&state.db, id)
        .await?
        .ok_or(AppError::NotFound)?;

    let template = ComponentFormTemplate {
        component: Some(component),
        categories: Vec::from(crate::models::DEFAULT_CATEGORIES),
        packages: Vec::from(crate::models::COMMON_PACKAGES),
    };

    Ok(Html(template.render()?))
}

// API Handlers
pub async fn list_components(
    State(state): State<AppState>,
) -> Result<Json<Vec<crate::models::Component>>, AppError> {
    let components = db::get_all_components(&state.db).await?;
    Ok(Json(components))
}

pub async fn get_component(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<crate::models::Component>, AppError> {
    let component = db::get_component_by_id(&state.db, id)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(component))
}

pub async fn create_component(
    State(state): State<AppState>,
    Json(component): Json<CreateComponent>,
) -> Result<(StatusCode, Json<crate::models::Component>), AppError> {
    let component = db::create_component(&state.db, component).await?;
    Ok((StatusCode::CREATED, Json(component)))
}

pub async fn update_component(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(update): Json<UpdateComponent>,
) -> Result<Json<crate::models::Component>, AppError> {
    let component = db::update_component(&state.db, id, update).await?;
    Ok(Json(component))
}

pub async fn delete_component(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<StatusCode, AppError> {
    db::delete_component(&state.db, id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn search_components(
    State(state): State<AppState>,
    Query(filter): Query<ComponentFilter>,
) -> Result<Json<Vec<crate::models::Component>>, AppError> {
    let components = db::search_components(&state.db, filter).await?;
    Ok(Json(components))
}

pub async fn list_categories(
    State(state): State<AppState>,
) -> Result<Json<Vec<crate::models::Category>>, AppError> {
    let categories = db::get_categories(&state.db).await?;
    Ok(Json(categories))
}