package jwt

import (
	"TimeWise/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

// Создание JWT токена
func CreateToken(user models.User) (string, error) {
	claims := models.Claims{
		ID: user.GormModel.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
		},
	}

	//@ Auth Data
	claims.Auth.Username = user.Auth.Username
	claims.Auth.Email = user.Auth.Email
	claims.Auth.Password = user.Auth.Password
	claims.Auth.Role = user.Auth.Role

	//@ Personal Data
	claims.Personal.Name = user.Personal.Name
	claims.Personal.Surname = user.Personal.Surname
	claims.Personal.Patronymic = user.Personal.Patronymic
	claims.Personal.BirthDate = user.Personal.BirthDate
	claims.Personal.PhoneNumber = user.Personal.PhoneNumber

	//@ Location Data
	claims.Location.Country = user.Location.Country
	claims.Location.City = user.Location.City

	//@ Tasks
	for _, task := range user.Tasks {
		claims.Tasks = append(claims.Tasks, models.Task{
			GormModel:   task.GormModel,
			UserID:      task.UserID,
			Title:       task.Title,
			Description: task.Description,
			IsCompleted: task.IsCompleted,
			DueDate:     task.DueDate,
		})
	}

	//@ Events
	for _, event := range user.Events {
		claims.Events = append(claims.Events, models.Event{
			GormModel:   event.GormModel,
			UserID:      event.UserID,
			Title:       event.Title,
			Description: event.Description,
			EventDate:   event.EventDate,
			EventTime:   event.EventTime,
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
