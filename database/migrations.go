package database

import (
	"database/sql"
	"fmt"
)

func runMigrations() error {
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	defer db.Close()

	// Run migrations here
	return nil
}
