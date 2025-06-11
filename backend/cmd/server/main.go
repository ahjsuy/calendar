package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)
func main() {
	fmt.Println("Server running! New!")
	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
	conn, err := connect()
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v\n", err)
	}
	defer conn.Close(context.Background())

	queryData(conn)
}

func connect() (*pgx.Conn, error) {
	dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        return nil, fmt.Errorf("DATABASE_URL environment variable not set")
    }
    conn, err := pgx.Connect(context.Background(), dbURL)
    if err != nil {
        return nil, err
    }
    return conn, nil
}

func queryData(conn *pgx.Conn) {
    rows, err := conn.Query(context.Background(), "SELECT id, username FROM users")

    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id string
        var name string
        err := rows.Scan(&id, &name)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("User ID: %s, Name: %s\n", id, name)
    }
}