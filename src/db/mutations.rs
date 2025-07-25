use chrono::Utc;
use crate::db::DbResult;
use crate::error::AppError;
use crate::models::{Component, CreateComponent, UpdateComponent};
use sqlx::SqlitePool;
use super::queries::get_component_by_id;

pub async fn create_component(
    pool: &SqlitePool,
    component: CreateComponent,
) -> DbResult<Component> {
    let now = Utc::now();

    let id = sqlx::query!(
        r#"
        INSERT INTO components (name, category, value, package, quantity, min_quantity,
                              location, datasheet_url, supplier, supplier_code, unit_price,
                              notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        component.name,
        component.category,
        component.value,
        component.package,
        component.quantity,
        component.min_quantity,
        component.location,
        component.datasheet_url,
        component.supplier,
        component.supplier_code,
        component.unit_price,
        component.notes,
        now,
        now
    )
        .execute(pool)
        .await?
        .last_insert_rowid();

    get_component_by_id(pool, id)
        .await?
        .ok_or(AppError::NotFound)
}

pub async fn update_component(
    pool: &SqlitePool,
    id: i64,
    update: UpdateComponent,
) -> DbResult<Component> {
    let mut component = get_component_by_id(pool, id)
        .await?
        .ok_or(AppError::NotFound)?;

    // Update only provided fields
    if let Some(name) = update.name {
        component.name = name;
    }
    if let Some(category) = update.category {
        component.category = category;
    }
    if let Some(value) = update.value {
        component.value = Some(value);
    }
    // ... [rest of the field updates]

    component.updated_at = Utc::now();

    sqlx::query!(
        r#"
        UPDATE components
        SET name = ?, category = ?, value = ?, package = ?, quantity = ?,
            min_quantity = ?, location = ?, datasheet_url = ?, supplier = ?,
            supplier_code = ?, unit_price = ?, notes = ?, updated_at = ?
        WHERE id = ?
        "#,
        component.name,
        component.category,
        component.value,
        component.package,
        component.quantity,
        component.min_quantity,
        component.location,
        component.datasheet_url,
        component.supplier,
        component.supplier_code,
        component.unit_price,
        component.notes,
        component.updated_at,
        id
    )
        .execute(pool)
        .await?;

    Ok(component)
}

pub async fn delete_component(pool: &SqlitePool, id: i64) -> DbResult<()> {
    let result = sqlx::query!("DELETE FROM components WHERE id = ?", id)
        .execute(pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}