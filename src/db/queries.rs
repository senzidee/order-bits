use crate::db::DbResult;
use crate::models::{Component, Category};
use sqlx::SqlitePool;

pub async fn get_all_components(pool: &SqlitePool) -> DbResult<Vec<Component>> {
    let components = sqlx::query_as!(
        Component,
        r#"
        SELECT id, name, category, value, package, quantity, min_quantity,
               location, datasheet_url, supplier, supplier_code, unit_price,
               notes, created_at, updated_at
        FROM components
        ORDER BY category, name
        "#
    )
        .fetch_all(pool)
        .await?;

    Ok(components)
}

pub async fn get_component_by_id(pool: &SqlitePool, id: i64) -> DbResult<Option<Component>> {
    let component = sqlx::query_as!(
        Component,
        r#"
        SELECT id, name, category, value, package, quantity, min_quantity,
               location, datasheet_url, supplier, supplier_code, unit_price,
               notes, created_at, updated_at
        FROM components
        WHERE id = ?
        "#,
        id
    )
        .fetch_optional(pool)
        .await?;

    Ok(component)
}

pub async fn get_categories(pool: &SqlitePool) -> DbResult<Vec<Category>> {
    let categories = sqlx::query_as!(
        Category,
        r#"
        SELECT category as name, COUNT(*) as count
        FROM components
        GROUP BY category
        ORDER BY category
        "#
    )
        .fetch_all(pool)
        .await?;

    Ok(categories)
}