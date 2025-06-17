package middleware

import (
	"calendar_project/backend/cmd/server/utils"
	"log"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context){
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer "){
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token invalid"})
		return
	}
	
	token := strings.TrimPrefix(authHeader, "Bearer ")
	userID, err := utils.VerifyToken(token)
	if err != nil {
		log.Printf(" verify token error: %s", err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized access"})
		return
	}
	c.Set("userID", userID)
	c.Next()
}

func GroupOwnershipMiddleWare(c *gin.Context){
	userID, err := utils.GetUser(c)
	groupID, err := utils.GetGroup(c)
	if err != nil {
		return
	} else {
		conn, err := utils.GetDB(c)
		if err != nil {
			return
		}
		defer conn.Close(c.Request.Context())

		var owner string
		err = conn.QueryRow(c.Request.Context(), "SELECT owner_id FROM groups WHERE id=$1", groupID).Scan(&owner)
		if err != nil {
			log.Println(err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error":"error scanning groupID"})
			return
		}
		if owner != userID {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"only owner can make this change"})
			return
		}
	}
}

func EventWritePermissionMiddleWare(c *gin.Context){
	userID, err := utils.GetUser(c)
	eventID, err := utils.GetEvent(c)
	calendarID, err := utils.GetCalendar(c)
	if err != nil {
		return
	} else {
		conn, err := utils.GetDB(c)
		if err != nil {
			return
		}
		defer conn.Close(c.Request.Context())

		var owner string
		var members string
		err = conn.QueryRow(c.Request.Context(), 
			"SELECT c.owner_id FROM calendars c JOIN events e on c.id = e.calendar_id WHERE e.id=$1",
			eventID).
			Scan(&owner)
		err2 := conn.QueryRow(c.Request.Context(), 
			"SELECT gm.member_id FROM calendar_groups cg JOIN group_members gm ON cg.group_id = gm.group_id WHERE cg.calendar_id=$1 AND cg.permission='write'",
			calendarID).
			Scan(&members)
		if (err != nil && err != pgx.ErrNoRows) || (err2 != nil && err2 != pgx.ErrNoRows) {
			log.Println(err2)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error":"error scanning ID from database"})
			return
		}
		if owner != userID && !strings.Contains(members, userID) {
			log.Printf("Owner check: %s %s", owner, userID)
			log.Printf("Member check: %s, %s", members, userID)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"user does not possess permission to make this change"})
			return
		}
	}
}