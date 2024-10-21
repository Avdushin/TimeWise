// middlewares/auth.go
package middlewares

import (
	"TimeWise/models"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func AuthMiddle() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, token")

		tokenString, err := c.Cookie("token")
		if err != nil || tokenString == "" {
			fmt.Println("No token found")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized from middleware"})
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			fmt.Println("Invalid token:", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(*models.Claims)
		if !ok || !token.Valid {
			fmt.Println("Invalid or expired token")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Set user claims in the context
		c.Set("user", *claims)
		c.Next()
	}
}

// AuthMiddleware is a middleware to check if the request is authenticated
// func AuthMiddle() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, token")

// 		tokenString, err := c.Cookie("token")
// 		if err != nil || tokenString == "" {
// 			logger.Error("No token found")
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 			return
// 		}

// 		token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
// 			return []byte(os.Getenv("JWT_SECRET")), nil
// 		})

// 		if err != nil {
// 			fmt.Println("Invalid token:", err)
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
// 			return
// 		}

// 		claims, ok := token.Claims.(*models.Claims)
// 		if !ok || !token.Valid {
// 			fmt.Println("Invalid or expired token")
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
// 			return
// 		}

// 		// Set user claims in the context
// 		c.Set("user", claims)
// 	}
// }
