package handlers

import (
	"context"
	"log"
	"net/http"

	"calendar_project/backend/cmd/server/db"
	"calendar_project/backend/cmd/server/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(c *gin.Context){
	var user struct {
		Email string  `json:"email"`
		Password string `json:"password"` 
		Username string `json:"username"`
	} 

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
	}

	password_hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	
	conn, _ := db.Connect()
	defer conn.Close(context.Background())

	_, err := conn.Exec(context.Background(), 
	"INSERT INTO users (username, password_hash, email) values($1, $2, $3)", user.Username, password_hash, user.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server could not create user"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message":"user created"})
	
}
func LoginHandler(c *gin.Context) {
	var user struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}

	conn, _ := db.Connect()
	defer conn.Close(context.Background())

	var id string
	var hash string
	err := conn.QueryRow(context.Background(),
		"SELECT id, password_hash FROM users WHERE email=$1", user.Email).Scan(&id, &hash)

	log.Printf("email : %s returned DB: %s %s", user.Email, hash, id)

	if err != nil || bcrypt.CompareHashAndPassword([]byte(hash), []byte(user.Password)) != nil {
		log.Printf("Query error: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error":"invalid credentials"})
		return
	}

	token, _ := utils.CreateToken(id)
	c.IndentedJSON(http.StatusOK, gin.H{"token":token})
}


// func RegisterHandler(w http.ResponseWriter, r *http.Request){
// 	// define user struct
// 	// decode req body
// 	// hash the pw
// 	// connect to db
// 	// create user in db
// 	// write error/success status
// 	var user struct {
// 		Email string  `json:"email"`
// 		Password string `json:"password"` 
// 		Username string `json:"username"`
// 	}

// 	json.NewDecoder(r.Body).Decode(&user)

// 	password_hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	
// 	conn, _ := db.Connect()
// 	defer conn.Close(context.Background())

// 	_, err := conn.Exec(context.Background(), 
// 	"INSERT INTO users (username, password_hash, email) values($1, $2, $3)", user.Username, password_hash, user.Username)

// 	if err != nil {
// 		http.Error(w, "user creation failed", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusCreated)
	
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	var user struct {
// 		Email string `json:"email"`
// 		Password string `json:"password"`
// 	}

// 	json.NewDecoder(r.Body).Decode(&user)

// 	conn, _ := db.Connect()
// 	defer conn.Close(context.Background())

// 	var id int
// 	var hash string
// 	err := conn.QueryRow(context.Background(),
// 		"SELECT id, password_hash FROM users WHERE email=$1", user.Email).Scan(&id, &hash)

// 	if err != nil || bcrypt.CompareHashAndPassword([]byte(hash), []byte(user.Password)) != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}

// 	token, _ := utils.CreateToken(id)
// 	json.NewEncoder(w).Encode(map[string]string{"token": token})
// }