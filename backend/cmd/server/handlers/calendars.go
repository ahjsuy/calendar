package handlers

import (
	"calendar_project/backend/cmd/server/utils"
	"fmt"
	"log"
	"strings"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Calendar struct {
	ID				string `json:"id"`
	OwnerID			string `json:"ownerid"`
	Name			string `json:"name"`
	Description 	string `json:"description"`
	CreatedAt		time.Time `json:"createdAt"`
}

type CalendarGroup struct {
	ID				string `json:"id"`
	OwnerID			string `json:"ownerID"`
	Name			string `json:"name"`
	Color		 	string `json:"color"`
	Permission		string `json:"permission"`
	Visibility		string `json:"visibility"`
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

func GetOwnedCalendarsHandler(c* gin.Context) {
	userID, exists := utils.GetUser(c)
	if exists != nil {
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	rows, err := conn.Query(c.Request.Context(), "SELECT id, name, description FROM calendars WHERE owner_id=$1", userID)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message":"server could not retrieve calendar"})
		return
	}

	defer rows.Close()

	var calendars []Calendar

	for rows.Next() {
		var cal Calendar
		if err := rows.Scan(&cal.ID,  &cal.Name, &cal.Description); err != nil {
			log.Println(err)
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
	query := "SELECT c.* FROM calendars c JOIN calendar_groups cg ON c.id = cg.calendar_id JOIN group_members gm ON gm.group_id = cg.group_id WHERE gm.member_id='" + userID + "'"
	rows, err := conn.Query(c.Request.Context(), query)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message":"server could not retrieve calendar"})
		return
	}

	defer rows.Close()

	var calendars []Calendar

	for rows.Next() {
		var cal Calendar
		if err := rows.Scan(&cal.ID, &cal.OwnerID, &cal.Name, &cal.Description, &cal.CreatedAt); err != nil {
			log.Printf("This is the error: %s",err)
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

func AddGroupsToCalendar(c *gin.Context){

	var payload struct {
		Groups string `json:"groups"`
		Permissions string `json:"permissions"`
		Visibilities string `json:"visibilities"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	calendarID, err := utils.GetCalendar(c)
	if err != nil {
		return
	}
	
	groupIDs := strings.Split(payload.Groups, ",")
	permissions := strings.Split(payload.Permissions, ",")
	visibilities := strings.Split(payload.Visibilities, ",")
	if len(groupIDs) != len(permissions) && len(permissions) != len(visibilities) {
		c.JSON(http.StatusBadRequest, gin.H{"error":"number of groupids, permissions, visibilites do not match"})
	}

	if len(groupIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no groups provided"})
		return
	}

	valueStrings := []string{}
	for i, _ := range groupIDs {
		trimmedGroup := strings.TrimSpace(groupIDs[i])
		trimmedPermission := strings.TrimSpace(permissions[i])
		trimmedVisibility := strings.TrimSpace(visibilities[i])
		if trimmedGroup != "" && trimmedPermission != "" && trimmedVisibility != "" {
			valueStrings = append(valueStrings, fmt.Sprintf("('%s','%s','%s','%s')", 
			calendarID, trimmedGroup, trimmedPermission, trimmedVisibility))
		}
	}

	if len(valueStrings) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no valid group perms provided"})
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	query := fmt.Sprintf(
		"INSERT INTO calendar_groups (calendar_id, group_id, permission, visibility) VALUES %s",
	strings.Join(valueStrings, ","))

	if _, err := conn.Exec(c.Request.Context(), query); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add group perms to calendar"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Groups added to calendar!"})
}

func EditGroupToCalendar(c *gin.Context){

	var payload struct {
		GroupID string `json:"group"`
		Permission string `json:"permission"`
		Visibility string `json:"visibility"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
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
		"UPDATE calendar_groups SET permission=$1, visibility=$2 WHERE group_id=$3 AND calendar_id=$4",
		payload.Permission, payload.Visibility, payload.GroupID, calendarID)
	if err != nil {
		log.Println(err, payload.GroupID, calendarID)
		c.JSON(http.StatusInternalServerError, gin.H{"error":"database could not execute query"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message":"group successfully updated!"})

	
}

func DeleteGroupsToCalendar(c *gin.Context){

	var payload struct {
		Groups string `json:"groups"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
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

	var groups []string
	groupStrs := strings.Split(payload.Groups, ",")
	for _, item := range groupStrs {
		var group string = fmt.Sprintf("'%s'", item)
		groups = append(groups, group)
	}

	if _, err := conn.Exec(c.Request.Context(),
		fmt.Sprintf("DELETE FROM calendar_groups cg WHERE cg.calendar_id='%s' AND cg.group_id IN (%s)", calendarID, strings.Join(groups, ","))); err != nil {
		log.Println(err)
		log.Println(fmt.Sprintf("DELETE FROM calendar_groups cg WHERE cg.calendar_id='%s' AND cg.group_id IN (%s)", calendarID, strings.Join(groups, ",")))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database could not drop column"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Groups deleted from calendar!"})
}

func GetGroupsForCalendar(c *gin.Context){
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
	"SELECT group_id FROM calendar_groups cg WHERE cg.calendar_id=$1", calendarID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"server could not retrieve groups"})
		return
	}
	defer rows.Close()
	
	var groups []string

	for rows.Next(){
		var group string
		if err := rows.Scan(&group); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error":"error scanning groups"})
			return
		}
		groups = append(groups, group)
	}
	

	var groupObjs []CalendarGroup

	for _, item := range groups {
		var groupObj CalendarGroup
		err := conn.QueryRow(c.Request.Context(), 
			"SELECT id, owner_id, name, color, permission, visibility FROM groups JOIN calendar_groups ON groups.id = calendar_groups.group_id AND calendar_groups.calendar_id=$1 WHERE groups.id=$2",
			calendarID, item).
			Scan(&groupObj.ID, &groupObj.OwnerID, &groupObj.Name, &groupObj.Color, &groupObj.Permission, &groupObj.Visibility)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error":"server could not retrieve groups"})
			return
		}
		groupObjs = append(groupObjs, groupObj)
	}

	c.JSON(http.StatusOK, gin.H{"groups": groupObjs })
}