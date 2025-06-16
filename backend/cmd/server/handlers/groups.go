package handlers

import (
	"calendar_project/backend/cmd/server/utils"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type Group struct {
	ID				string `json:"id"`
	OwnerID			string `json:"ownerID"`
	Name			string `json:"name"`
	Color		 	string `json:"color"`
}

func CreateGroupsHandler(c *gin.Context){
	var payload struct {
		OwnerID string 
		Name	string `json:"name"`
		Color	string `json:"color"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}

	userID, err := utils.GetUser(c)
	if err != nil {
		return
	}

	payload.OwnerID = userID

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	if err := utils.CreateRowDB(conn, c, 
		"groups", 
		"owner_id, name, color", 
		fmt.Sprintf("'%s', '%s', '%s'", payload.OwnerID, payload.Name, payload.Color)); err != nil{
			return
		}

	c.JSON(http.StatusCreated, gin.H{"message": "group created!"})

}

func GetGroupsUserIsOwner(c *gin.Context){
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
	query := "SELECT id, name, color FROM groups G WHERE owner_id='" + userID + "'"
	rows, err := conn.Query(c.Request.Context(), query)

	if err != nil {
		log.Println(err)
		log.Println(query)
		c.JSON(http.StatusInternalServerError, gin.H{"message":"server could not retrieve groups"})
		return
	}

	defer rows.Close()

	var groups []Group

	for rows.Next() {
		var g Group
		if err := rows.Scan(&g.ID, &g.Name, &g.Color); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error scanning group"})
			return
		}
		groups = append(groups, g)
	}

	c.JSON(http.StatusOK, gin.H{"groups": groups })
}

func DeleteGroupHandler(c *gin.Context){
	groupID, err := utils.GetGroup(c)
	if err != nil {
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
	"DELETE FROM groups g WHERE g.owner_id=$1 AND g.id=$2", userID, groupID)
	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error":"Calendar not found or owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message":"Group deleted"})
}

// add groups to calendars

// add members to groups

func AddGroupMembersHandlers (c *gin.Context){

	var payload struct {
		Members string `json:"members"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	groupID, err := utils.GetGroup(c)
	if err != nil {
		return
	}

	memberIDs := strings.Split(payload.Members, ",")
	if len(memberIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no members provided"})
		return
	}

	valueStrings := []string{}
	for _, member := range memberIDs {
		trimmed := strings.TrimSpace(member)
		if trimmed != "" {
			valueStrings = append(valueStrings, fmt.Sprintf("('%s', '%s')", trimmed, groupID))
		}
	}

	if len(valueStrings) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no valid member IDs provided"})
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	query := fmt.Sprintf(
		"INSERT INTO group_members (member_id, group_id) VALUES %s",
		strings.Join(valueStrings, ","),
	)

	if _, err := conn.Exec(c.Request.Context(), query); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add members"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "members added!"})
}

func DeleteGroupMembersHandlers (c *gin.Context){

	var payload struct {
		Members string `json:"members"`
	}

	if err := c.Bind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	groupID, err := utils.GetGroup(c)
	if err != nil {
		return
	}

	memberIDs := strings.Split(payload.Members, ",")
	if len(memberIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no members provided"})
		return
	}

	valueStrings := []string{}
	for _, member := range memberIDs {
		trimmed := strings.TrimSpace(member)
		if trimmed != "" {
			valueStrings = append(valueStrings, fmt.Sprintf("'%s'", trimmed))
		}
	}

	if len(valueStrings) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no valid member IDs provided"})
		return
	}

	conn, err := utils.GetDB(c)
	if err != nil {
		return
	}
	defer conn.Close(c.Request.Context())

	query := fmt.Sprintf(
		"DELETE FROM group_members gm WHERE gm.group_id='%s' AND gm.member_id IN (%s)",
		groupID,
		strings.Join(valueStrings, ","),
	)

	if _, err := conn.Exec(c.Request.Context(), query); err != nil {
		log.Panicln(query)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete members"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "members deleted!"})
}