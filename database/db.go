package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	var err error
	connStr := os.Getenv("DB_URL")

	// Buat debug koneksi
	fmt.Println("Connecting to database with URL:", connStr)

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Gagal koneksi database: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database ping failed: ", err)
	}

	log.Println("Berhasil terhubung ke Supabase!")
}
