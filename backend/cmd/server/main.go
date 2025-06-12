package main

import (
	"calendar_project/backend/cmd/server/handlers"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)
func main() {

	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    http.HandleFunc("/auth/register", handlers.RegisterHandler)
    http.HandleFunc("/auth/login", handlers.LoginHandler)

    log.Println("Server running on http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}



// func queryData(conn *pgx.Conn) {
//     rows, err := conn.Query(context.Background(), "SELECT id, username FROM users")

//     if err != nil {
//         log.Fatal(err)
//     }
//     defer rows.Close()

//     for rows.Next() {
//         var id string
//         var name string
//         err := rows.Scan(&id, &name)
//         if err != nil {
//             log.Fatal(err)
//         }
//         fmt.Printf("User ID: %s, Name: %s\n", id, name)
//     }
// }