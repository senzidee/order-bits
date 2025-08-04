package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"order-bits/database"
	"order-bits/handlers"
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

func setupRoutes() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/components", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetComponentsHandler(w, r)
		case http.MethodPost:
			handlers.CreateComponentHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/components/", handlers.GetComponentHandler)

	// Admin endpoints
	http.HandleFunc("/admin/migrations", handlers.GetMigrationsStatusHandler)
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
	fmt.Println("  GET  /components")
	fmt.Println("  GET  /components/{id}")
	fmt.Println("  POST /components")

	log.Fatal(http.ListenAndServe(port, nil))
}
