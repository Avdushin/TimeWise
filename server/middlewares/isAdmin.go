package middlewares

import (
	"TimeWise/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Middleware для проверки, является ли пользователь администратором
func IsAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			fmt.Println("No user data found")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// Print user details for debugging
		userClaims, ok := user.(*models.Claims)
		if !ok {
			fmt.Println("Invalid user data")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user data"})
			c.Abort()
			return
		}
		// fmt.Printf("User ID: %d, Username: %s, Role: %s\n", userClaims.ID, userClaims.Username, userClaims.Role)

		// Check if the role is admin
		if userClaims.Auth.Role != string(models.Admin) {
			fmt.Println("Access denied")
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		// Continue with the request
		c.Next()
	}
}
