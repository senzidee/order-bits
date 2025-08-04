package database

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB() error {
	var err error
	db, err = sql.Open("sqlite3", "./inventory.db")
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	if err = runMigrations(); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	fmt.Println("Database initialized successfully")
	return nil
}

func CloseDB() error {
	if err := db.Close(); err != nil {
		return fmt.Errorf("failed to close database: %w", err)
	}
	return nil
}

func GetDB() *sql.DB {
	return db
}
