package database

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type Migration struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	ExecutedAt time.Time `json:"executed_at"`
}

func createMigrationsTable() error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS migrations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	return nil
}

func getExecutedMigrations() (map[string]bool, error) {
	executed := make(map[string]bool)

	rows, err := db.Query("SELECT name FROM migrations ORDER BY name")
	if err != nil {
		return nil, fmt.Errorf("failed to query executed migrations: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, fmt.Errorf("failed to scan migration name: %w", err)
		}
		executed[name] = true
	}

	return executed, rows.Err()
}

func getMigrationFiles(migrationsDir string) ([]string, error) {
	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read migrations directory %s: %w", migrationsDir, err)
	}

	var migrationFiles []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(strings.ToLower(file.Name()), ".sql") {
			migrationFiles = append(migrationFiles, file.Name())
		}
	}

	// Sort migrations to ensure they run in order
	sort.Strings(migrationFiles)

	return migrationFiles, nil
}

func executeMigration(migrationPath, migrationName string) error {
	// Read migration file
	sqlBytes, err := os.ReadFile(migrationPath)
	if err != nil {
		return fmt.Errorf("failed to read migration file %s: %w", migrationPath, err)
	}

	sqlContent := string(sqlBytes)

	// Execute the migration SQL
	_, err = db.Exec(sqlContent)
	if err != nil {
		return fmt.Errorf("failed to execute migration %s: %w", migrationName, err)
	}

	// Record the migration as executed
	_, err = db.Exec("INSERT INTO migrations (name) VALUES (?)", migrationName)
	if err != nil {
		return fmt.Errorf("failed to record migration %s: %w", migrationName, err)
	}

	fmt.Printf("✓ Migration %s executed successfully\n", migrationName)
	return nil
}

func runMigrations() error {
	migrationsDir := "api/migrations"

	// Create migrations tracking table if it doesn't exist
	if err := createMigrationsTable(); err != nil {
		return err
	}

	// Get list of already executed migrations
	executed, err := getExecutedMigrations()
	if err != nil {
		return err
	}

	// Get list of migration files
	migrationFiles, err := getMigrationFiles(migrationsDir)
	if err != nil {
		return err
	}

	if len(migrationFiles) == 0 {
		fmt.Println("No migration files found in migrations/ directory")
		return nil
	}

	newMigrationsCount := 0

	// Execute new migrations
	for _, filename := range migrationFiles {
		if executed[filename] {
			fmt.Printf("- Migration %s already executed, skipping\n", filename)
			continue
		}

		migrationPath := filepath.Join(migrationsDir, filename)
		if err := executeMigration(migrationPath, filename); err != nil {
			return fmt.Errorf("migration %s failed: %w", filename, err)
		}

		newMigrationsCount++
	}

	if newMigrationsCount == 0 {
		fmt.Println("✓ All migrations are up to date")
	} else {
		fmt.Printf("✓ Successfully executed %d new migration(s)\n", newMigrationsCount)
	}

	return nil
}

// GetMigrationStatus returns the status of all migrations (for debugging/admin purposes)
func GetMigrationStatus() ([]Migration, error) {
	var migrations []Migration

	rows, err := db.Query("SELECT id, name, executed_at FROM migrations ORDER BY executed_at")
	if err != nil {
		return nil, fmt.Errorf("failed to query migrations: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var migration Migration
		if err := rows.Scan(&migration.ID, &migration.Name, &migration.ExecutedAt); err != nil {
			return nil, fmt.Errorf("failed to scan migration: %w", err)
		}
		migrations = append(migrations, migration)
	}

	return migrations, rows.Err()
}
