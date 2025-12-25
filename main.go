package main

import (
	"fmt"
	"group-task-organizer/database"
	"group-task-organizer/handlers"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// Middleware CORS agar Frontend Next.js bisa akses
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// load env
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Koneksi Database
	database.Connect()

	// Routing
	mux := http.NewServeMux()

	// User Endpoint
	mux.HandleFunc("GET /users", handlers.GetUsers)
	mux.HandleFunc("POST /users", handlers.CreateUser)
	mux.HandleFunc("DELETE /users/{id}", handlers.DeleteUser)

	// Task Endpoint
	mux.HandleFunc("GET /users/{id}/tasks", handlers.GetUserTasks)
	mux.HandleFunc("POST /users/{id}/tasks", handlers.CreateTask)
	mux.HandleFunc("PUT /tasks/{id}", handlers.UpdateTask)
	mux.HandleFunc("DELETE /tasks/{id}", handlers.DeleteTask)

	// Jalanin servernya
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, enableCORS(mux)))
}
