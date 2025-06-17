package handlers

import (
	"calendar_project/backend/cmd/server/utils"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Event struct {
	ID				string		`json:"id"`
	CalendarID 		string		`json:"calendarID"`
	Name 			string		`json:"name"`
	StartDate 		time.Time	`json:"startDate"`
	EndDate 		time.Time	`json:"endDate"`
	Visibility 		string		`json:"visibility"`
	CreatedAt		time.Time 	`json:"createdAt"`
}

func CreateEventsHandlers(c *gin.Context){
	// userid, err := utils.GetUser(c)
	// if err != nil {
	// 	return
	// }

	calendarID, err := utils.GetCalendar(c)
	if err != nil {
		return
	}

	var event struct {
		CalendarID 		string	
		Name 			string	`json:"name"`
		StartDate 		string	`json:"startDate"`
		EndDate 		string	`json:"endDate"`
		Visibility 		string	`json:"visibility"`
	}

	if err := c.Bind(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}

	event.CalendarID = calendarID

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	// check if user has perms

	// perm, err := conn.QueryRow(c.Request.Context(),
	// "SELECT permission") 
	
	if err := utils.CreateRowDB(conn, c, 
		"events", 
		"calendar_id, name, start_date, end_date, visibility", 
		fmt.Sprintf("'%s', '%s', '%s', '%s', '%s'", event.CalendarID, event.Name, event.StartDate, event.EndDate, event.Visibility)); err != nil{
			return
		}
	
	c.JSON(http.StatusCreated, gin.H{"message": "event created!"})
}

func GetEventsHandler(c *gin.Context) {
	// get the userid, calendarid
	// connect to the db
	// query 

	// userid, err := utils.GetUser(c)
	// if err != nil {
	// 	return
	// }

	calendarID, err := utils.GetCalendar(c)
	if err != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	rows, err := conn.Query(c.Request.Context(),
		"SELECT * FROM events WHERE events.calendar_id=$1", calendarID)
	
	var events []Event

	for rows.Next(){
		var e Event
		if err := rows.Scan(&e.ID, &e.CalendarID, &e.Name, &e.StartDate, &e.EndDate, &e.Visibility, &e.CreatedAt); err != nil{
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error":"error scanning events"})
			return
		}
		events = append(events, e)
	}

	c.JSON(http.StatusOK, gin.H{"events":events})

}

func EditEventHandler(c *gin.Context){
	var payload struct {
		Name 		string	`json:"name"`
		StartDate 	string	`json:"startDate"`
		EndDate 	string	`json:"endDate"`
		Visibility 	string	`json:"visibility"`
	}
	
	calendarID, err := utils.GetCalendar(c)
	if err != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	_, err = conn.Exec(c.Request.Context(),
		"UPDATE events SET name=$1, start_date=$2, end_date=$3, visibility=$4 WHERE calendar_id=$5",
		payload.Name, payload.StartDate, payload.EndDate, payload.Visibility, calendarID)	

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"database could not update event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message":"Event Updated"})

}

func DeleteEventHandler(c *gin.Context) {
	eventID, err := utils.GetEvent(c)
	if err != nil {
		return
	}
	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	result, _ := conn.Exec(c.Request.Context(), 
	"DELETE FROM events WHERE events.id=$1", eventID)
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error":"Event not found or owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message":"Event deleted"})
}