package middleware

import (
	"calendar_project/backend/cmd/server/utils"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request){
// 		tokenStr := r.Header.Get("Authorization")
// 		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

// 		userID, err := utils.VerifyToken(tokenStr)
// 		if err != nil {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 		}

// 		ctx := context.WithValue(r.Context(), "userID", userID)
// 		next(w, r.WithContext(ctx))
// 	}
// }

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