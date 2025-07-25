mod queries;
mod mutations;
mod filters;

pub use queries::*;
pub use mutations::*;
pub use filters::*;

pub type DbResult<T> = Result<T, crate::error::AppError>;
