use crate::db::DbResult;
use crate::models::{Component, ComponentFilter};
use sqlx::SqlitePool;

pub async fn search_components(
    pool: &SqlitePool,
    filter: ComponentFilter,
) -> DbResult<Vec<Component>> {
    let mut query = String::from(
        r#"
        SELECT id, name, category, value, package, quantity, min_quantity,
               location, datasheet_url, supplier, supplier_code, unit_price,
               notes, created_at, updated_at
        FROM components
        WHERE 1=1
        "#,
    );

    let mut conditions = vec![];

    if let Some(category) = &filter.category {
        conditions.push(format!("category = '{}'", category));
    }

    if let Some(search) = &filter.search {
        conditions.push(format!(
            "(name LIKE '%{}%' OR value LIKE '%{}%' OR notes LIKE '%{}%')",
            search, search, search
        ));
    }

    if let Some(true) = filter.low_stock {
        conditions.push("quantity <= min_quantity".to_string());
    }

    if !conditions.is_empty() {
        query.push_str(" AND ");
        query.push_str(&conditions.join(" AND "));
    }

    query.push_str(" ORDER BY category, name");

    let components = sqlx::query_as::<_, Component>(&query)
        .fetch_all(pool)
        .await?;

    Ok(components)
}