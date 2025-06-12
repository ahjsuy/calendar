package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

func Connect() (*pgx.Conn, error) {
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

func Test(){
	fmt.Println("Hello!")
}