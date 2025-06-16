package main

import (
	"calendar_project/backend/cmd/server/handlers"
	"calendar_project/backend/cmd/server/middleware"

	"github.com/gin-gonic/gin"

	"log"

	"github.com/joho/godotenv"
)
func main() {

	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    router := gin.Default()

    auth := router.Group("/auth")
    {
        auth.POST("/register", handlers.RegisterHandler)
        auth.POST("/login", handlers.LoginHandler)
    }

    api := router.Group("/api")
    api.Use(middleware.AuthMiddleware)

    groups := api.Group("/groups")
    {
        groups.GET("/", handlers.GetGroupsUserIsOwner)
        groups.POST("/", handlers.CreateGroupsHandler)
        groups.DELETE("/:groupID", handlers.DeleteGroupHandler)
        groups.POST("/:groupID/members", handlers.AddGroupMembersHandlers)
        groups.DELETE("/:groupID/members", handlers.DeleteGroupMembersHandlers)
    }

    calendars := api.Group("/calendars")
    {
        calendars.GET("/", handlers.GetCalendarHandler)
        calendars.POST("/", handlers.CreateCalendarHandler)
        calendars.PUT("/:id", handlers.EditCalendarHandler)
        calendars.DELETE("/:id", handlers.DeleteCalendarHandler)
    }

    calendarEvents := calendars.Group("/:id")
    {
        calendarEvents.GET("/", handlers.GetEventsHandler)
        calendarEvents.POST("/", handlers.CreateEventsHandlers)
    }
     
    router.Run("localhost:8081")
}

// to do list: add groups to calendars
// remove groups from calendars, change group perms
// get all groups user owns, get all groups a calendar owns
// get all calendars user is group of, allow event edits based on perms
// edit events, delete events
// do frontend