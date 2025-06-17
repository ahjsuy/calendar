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
        groups.GET("/", handlers.GetGroupsUserIsOwnerHandler)
        groups.POST("/", handlers.CreateGroupsHandler)

        groups.GET("/:groupID", handlers.GetGroupHandler)
        groups.PUT("/:groupID", middleware.GroupOwnershipMiddleWare, handlers.EditGroupsHandler)
        groups.DELETE("/:groupID", middleware.GroupOwnershipMiddleWare, handlers.DeleteGroupHandler)

        groups.GET("/:groupID/members", handlers.GetGroupMembersHandler)
        groups.POST("/:groupID/members", middleware.GroupOwnershipMiddleWare, handlers.AddGroupMembersHandlers)
        groups.DELETE("/:groupID/members", middleware.GroupOwnershipMiddleWare, handlers.DeleteGroupMembersHandlers)
    }

    calendars := api.Group("/calendars")
    {

        calendars.GET("/owned", handlers.GetOwnedCalendarsHandler)
        calendars.GET("/", handlers.GetCalendarsUserCanRead)
        calendars.POST("/", handlers.CreateCalendarHandler)

        calendars.PUT("/:calendarID", handlers.EditCalendarHandler)
        calendars.DELETE("/:calendarID", handlers.DeleteCalendarHandler)

        calendars.GET("/:calendarID/groups", handlers.GetGroupsForCalendar)
        calendars.POST("/:calendarID/groups", handlers.AddGroupsToCalendar)
        calendars.PUT("/:calendarID/groups", handlers.EditGroupToCalendar)
        calendars.DELETE("/:calendarID/groups", handlers.DeleteGroupsToCalendar)
    }

    calendarEvents := calendars.Group("/:calendarID")
    {
        calendarEvents.GET("/", handlers.GetEventsHandler)
        calendarEvents.POST("/", handlers.CreateEventsHandlers)
        calendarEvents.PUT("/:eventID", middleware.EventWritePermissionMiddleWare, handlers.EditEventHandler)
        calendarEvents.DELETE("/:eventID", middleware.EventWritePermissionMiddleWare, handlers.DeleteEventHandler)
    }

    users := api.Group("/users")
    {
        users.GET("/:username", handlers.GetUserHandler)
    }
     
    router.Run("localhost:8081")
}

// to do list: 
//  delete events
// 
// do frontend