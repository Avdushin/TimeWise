package middlewares

import (
	"TimeWise/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Middleware для проверки доступа к странице
func AccessMiddleware(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		userClaims, ok := user.(*models.Claims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid user data"})
			return
		}

		// fmt.Printf("User Role in Middleware: %s\n", userClaims.Role)

		if userClaims.Auth.Role != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			return
		}
	}
}
