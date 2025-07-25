use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Component {
    pub id: i64,
    pub name: String,
    pub category: String,
    pub value: Option<String>,
    pub package: Option<String>,
    pub quantity: i32,
    pub min_quantity: Option<i32>,
    pub location: Option<String>,
    pub datasheet_url: Option<String>,
    pub supplier: Option<String>,
    pub supplier_code: Option<String>,
    pub unit_price: Option<f64>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateComponent {
    pub name: String,
    pub category: String,
    pub value: Option<String>,
    pub package: Option<String>,
    pub quantity: i32,
    pub min_quantity: Option<i32>,
    pub location: Option<String>,
    pub datasheet_url: Option<String>,
    pub supplier: Option<String>,
    pub supplier_code: Option<String>,
    pub unit_price: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateComponent {
    pub name: Option<String>,
    pub category: Option<String>,
    pub value: Option<String>,
    pub package: Option<String>,
    pub quantity: Option<i32>,
    pub min_quantity: Option<i32>,
    pub location: Option<String>,
    pub datasheet_url: Option<String>,
    pub supplier: Option<String>,
    pub supplier_code: Option<String>,
    pub unit_price: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComponentFilter {
    pub category: Option<String>,
    pub search: Option<String>,
    pub low_stock: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub name: String,
    pub count: i64,
}

// Categorie predefinite comuni per componenti elettronici
pub const DEFAULT_CATEGORIES: &[&str] = &[
    "Resistori",
    "Condensatori",
    "Induttori",
    "Diodi",
    "Transistor",
    "Circuiti Integrati",
    "Connettori",
    "Interruttori",
    "Relè",
    "Cristalli/Oscillatori",
    "Fusibili",
    "LED",
    "Display",
    "Sensori",
    "Microcontrollori",
    "Alimentatori",
    "Trasformatori",
    "Cavi",
    "PCB",
    "Altro",
];

// Packages comuni
pub const COMMON_PACKAGES: &[&str] = &[
    // SMD Resistori/Condensatori
    "0201", "0402", "0603", "0805", "1206", "1210", "2010", "2512",
    // Through-hole
    "DIP-8", "DIP-14", "DIP-16", "DIP-20", "DIP-28", "DIP-40",
    // SMD IC
    "SOIC-8", "SOIC-14", "SOIC-16", "TSSOP-8", "TSSOP-14", "TSSOP-16",
    "QFP-32", "QFP-44", "QFP-64", "QFP-100",
    "QFN-16", "QFN-20", "QFN-32", "QFN-48",
    // Transistor
    "TO-92", "TO-220", "SOT-23", "SOT-223",
    // Altri
    "Axial", "Radial", "BGA", "PLCC",
];