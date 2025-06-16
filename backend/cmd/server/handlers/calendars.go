package handlers

import (
	"calendar_project/backend/cmd/server/utils"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Calendar struct {
	ID				string `json:"id"`
	Name			string `json:"name"`
	Description 	string `json:"description"`
}

func CreateCalendarHandler(c *gin.Context){

	var payload struct {
		Name string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}

	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	_, err = conn.Exec(c.Request.Context(),
	"INSERT INTO calendars (owner_id, name, description) VALUES ($1, $2, $3)", userID, payload.Name, payload.Description)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"server could not create calendar"})
	}

	c.JSON(http.StatusCreated, gin.H{"message": "calendar created!"})

} 

func GetCalendarHandler(c* gin.Context) {
	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	rows, err := conn.Query(c.Request.Context(), "SELECT id, name, description FROM calendars WHERE ownerid=$1", userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message":"server could not retrieve calendar"})
		return
	}

	defer rows.Close()

	var calendars []Calendar

	for rows.Next() {
		var cal Calendar
		if err := rows.Scan(&cal.ID, &cal.Name, &cal.Description); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error scanning calendar"})
			return
		}
		calendars = append(calendars, cal)
	}

	c.JSON(http.StatusOK, gin.H{"calendars": calendars })
}

func GetCalendarsUserCanRead(c *gin.Context){
	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	// users join group members on id join calendar_groups on c.id join calendars
	query := "SELECT c.* FROM calendars c JOIN calendar_groups cg ON c.id = cg.calendar_id JOIN group_members gm ON gm.group_id = cg.group_id WHERE gm.member_id=" + userID
	rows, err := conn.Query(c.Request.Context(), query)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message":"server could not retrieve calendar"})
		return
	}

	defer rows.Close()

	var calendars []Calendar

	for rows.Next() {
		var cal Calendar
		if err := rows.Scan(&cal.ID, &cal.Name, &cal.Description); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error scanning calendar"})
			return
		}
		calendars = append(calendars, cal)
	}

	c.JSON(http.StatusOK, gin.H{"calendars": calendars })
}

func EditCalendarHandler(c* gin.Context){

	calendarIDStr := c.Param("id")
	calendarID, err := uuid.Parse(calendarIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid calendar ID"})
		return
	}

	var payload struct {
		Name string `json:"name"`
		Description string `json:"description"`
	} 

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}

	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	result, err := conn.Exec(c.Request.Context(), 
	"UPDATE calendars SET name=$1, description=$2 WHERE id=$3 AND owner_id =$4", payload.Name, payload.Description, calendarID, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"database update failed"})
		return
	}
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error":"Calendar not found or owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message":"Calendar updated"})
	
}

// func EditCalendarGroupsHandler(c *gin.Context){
// 	query := "INSERT INTO "
// }

func DeleteCalendarHandler(c *gin.Context){
	calendarIDStr := c.Param("id")
	calendarID, err := uuid.Parse(calendarIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid calendar ID"})
		return
	}
	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}
	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	result, err := conn.Exec(c.Request.Context(), 
	"DELETE FROM calendars WHERE calendars.id=$1 AND owner_id=$2", calendarID, userID)
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error":"Calendar not found or owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message":"Calendar deleted"})
}