package jwt

import (
	"TimeWise/models"
	"errors"
	"os"
	"strconv"

	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

var DB *gorm.DB

// @ Функция для валидации и извлечения данных из токена
func ValidateToken(tokenString string) (*models.User, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		// Получение данных пользователя из токена
		userId, err := strconv.Atoi(claims.Subject)
		if err != nil {
			return nil, err
		}

		var user models.User
		if err := DB.Where("id = ?", userId).First(&user).Error; err != nil {
			return nil, err
		}

		return &user, nil
	} else {
		return nil, errors.New("Invalid token")
	}
}
