package handlers

import (
	"calendar_project/backend/cmd/server/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID 			string	`json:"id"`
	Username 	string	`json:"username"`
	Email 		string	`json:"email"`
}

func GetUserHandler(c *gin.Context){
	// var payload struct {
	// 	Username 	string	`json:"username"`
	// }

	// if err := c.Bind(&payload); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
	// }

	username := c.Param("username")

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}

	var user User
	if err = conn.QueryRow(c.Request.Context(),
		"SELECT id, username, email FROM users WHERE users.username ILIKE $1", username).Scan(&user.ID, &user.Username, &user.Email);
		err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error":"server could not scan user"})
			return
		}
	c.JSON(http.StatusOK, gin.H{"user":user})
}