package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/senzidee/order-bits/api/database"
	"github.com/senzidee/order-bits/api/handlers"
)

// Health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{
		"status":  "OK",
		"message": "Server is running",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	fs := http.FileServer(http.Dir("static"))
	if r.URL.Path == "/" || "" == filepath.Ext(r.URL.Path) {
		http.ServeFile(w, r, "static/index.html")
		return
	}
	fs.ServeHTTP(w, r)
}

func setupRoutes() {
	http.HandleFunc("/", mainHandler)
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/components", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetComponentsHandler(w, r)
		case http.MethodPost:
			handlers.CreateComponentHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/components/search", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.SearchComponentsHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/components/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetComponentHandler(w, r)
		case http.MethodPut:
			handlers.UpdateComponentHandler(w, r)
		case http.MethodDelete:
			handlers.DeleteComponentHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Admin endpoints
	http.HandleFunc("/api/admin/migrations", handlers.GetMigrationsStatusHandler)
}

func main() {
	fmt.Println("Initializing database...")
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func() {
		if err := database.CloseDB(); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}()

	setupRoutes()

	port := ":8080"
	fmt.Printf("Server starting on port %s\n", port)
	fmt.Println("Available Endpoints:")
	fmt.Println("  GET  /health")
	fmt.Println("  GET  /api/components")
	fmt.Println("  GET  /api/components/search?term=<term>")
	fmt.Println("  GET  /api/components/{id}")
	fmt.Println("  POST /api/components")
	fmt.Println("  PUT  /api/components/{id}")
	fmt.Println("  DELETE /api/components/{id}")

	log.Fatal(http.ListenAndServe(port, nil))
}
