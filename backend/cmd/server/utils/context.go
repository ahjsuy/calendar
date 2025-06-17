package utils

import (
	"fmt"
	"log"
	"net/http"

	"calendar_project/backend/cmd/server/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func GetUser(c *gin.Context) (string, error) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID missing in context"})
		return "0", fmt.Errorf(("userID missing"))
	}

	return userID.(string), nil

}

func GetCalendar(c *gin.Context) (string, error) {
	calendarIDStr := c.Param("calendarID")
	calendarID, err := uuid.Parse(calendarIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"calendar ID missing in url"})
		return "0", fmt.Errorf(("calendarID missing"))
	}

	return calendarID.String(), nil

}

func GetGroup(c *gin.Context) (string, error) {
	groupIDStr := c.Param("groupID")
	groupID, err := uuid.Parse(groupIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"group ID missing in url"})
		return "0", fmt.Errorf(("groupID missing"))
	}

	return groupID.String(), nil

}

func GetEvent(c *gin.Context) (string, error) {
	eventIDStr := c.Param("eventID")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"event ID missing in url"})
		return "0", fmt.Errorf(("eventID missing"))
	}

	return eventID.String(), nil

}
func GetDB(c *gin.Context) (*pgx.Conn, error){
	conn, err := db.Connect()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"server could not connect to database"})
		return nil, fmt.Errorf(("server could not connect to database"))
	}
	return conn, nil
}


func CreateRowDB(conn *pgx.Conn, c *gin.Context, table string, columns string, values string)(error){
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", table, columns, values)
	_, err := conn.Exec(c.Request.Context(), query)
	if err != nil {
		log.Println(query)
		c.JSON(http.StatusInternalServerError, gin.H{"error":fmt.Sprintf("server could not insert into %s", table)})
		return err
	}
	return nil
}

func BindJSON[T any](c *gin.Context)(*T, bool){
	var payload T
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON: " + err.Error()})
		return nil, false
	}
	return &payload, true
}