package handlers

import (
	"TimeWise/models"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	cjwt "TimeWise/pkg/jwt"
	"TimeWise/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	gjwt "github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

var _ gorm.Model

// @Summary Обновление данных пользователя
// @Description Обновляет данные пользователя по указанному идентификатору.
// @Tags users
// @Security CookieAuth
// @Param id path int true "ID пользователя"
// @Param request body models.UpdateUserRequest true "Данные для обновления пользователя"
// @Success 200 {string} string "User updated successfully"
// @Failure 400 {string} string "Invalid user ID or request data"
// @Failure 401 {string} string "Unauthorized"
// @Failure 403 {string} string "Access denied"
// @Failure 404 {string} string "User not found"
// @Failure 500 {string} string "Failed to update user"
// @Router /api/users/update/{id} [put]
func (u *UserHandler) UpdateUser(c *gin.Context) {
	// Получение ID пользователя
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Получение данных запроса на обновление
	var updateRequest models.UpdateUserRequest
	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Поиск пользователя в базе данных
	var userToUpdate models.User
	if err := u.DB.First(&userToUpdate, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Обновление данных пользователя
	userToUpdate.Auth.Username = updateRequest.Auth.Username
	userToUpdate.Auth.Email = updateRequest.Auth.Email

	// Хеширование нового пароля (если был изменён)
	if updateRequest.PasswordChanged {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updateRequest.Auth.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash the password", "details": err.Error()})
			return
		}
		userToUpdate.Auth.Password = string(hashedPassword)
	}

	// Обновление персональных данных и локации
	userToUpdate.Personal.Name = updateRequest.Personal.Name
	userToUpdate.Personal.Surname = updateRequest.Personal.Surname
	userToUpdate.Personal.Patronymic = updateRequest.Personal.Patronymic
	userToUpdate.Personal.BirthDate = updateRequest.Personal.BirthDate
	userToUpdate.Personal.PhoneNumber = updateRequest.Personal.PhoneNumber
	userToUpdate.Location.Country = updateRequest.Location.Country
	userToUpdate.Location.City = updateRequest.Location.City

	// Сохранение изменений в базе данных
	if err := u.DB.Save(&userToUpdate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user", "details": err.Error()})
		return
	}

	// Генерация нового JWT токена для обновленных данных
	token, err := cjwt.CreateToken(userToUpdate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token", "details": err.Error()})
		return
	}

	// Ответ с успешным обновлением и новым токеном
	c.JSON(http.StatusOK, gin.H{
		"message": "Данные пользователя обновлены",
		"token":   token,
	})
}

// @Summary Обновление роли пользователя
// @Description Обновляет роль пользователя по указанному идентификатору
// @Description Роли: user, support, moderator, admin
// @Tags users
// @Security CookieAuth
// @Param id path int true "ID пользователя"
// @Param request body models.UpdateUserRoleRequest true "Данные для обновления роли пользователя" Enums[user, support, moderator, admin]
// @Success 200 {string} string "User role updated successfully"
// @Failure 400 {string} string "Invalid user ID or request data"
// @Failure 401 {string} string "Unauthorized"
// @Failure 403 {string} string "Access denied"
// @Failure 404 {string} string "User not found"
// @Failure 500 {string} string "Failed to update user role"
// @Router /api/users/update-role/{id} [put]
func (u *UserHandler) UpdateUserRole(c *gin.Context) {
	// Получение ID пользователя
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Получение данных запроса на обновление роли
	var updateRequest models.UpdateUserRoleRequest
	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Проверка валидности новой роли
	if !isValidRole(updateRequest.NewRole) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	// Поиск пользователя
	var userToUpdate models.User
	if err := u.DB.First(&userToUpdate, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Обновление роли
	userToUpdate.Auth.Role = updateRequest.NewRole

	// Сохранение данных
	if err := u.DB.Save(&userToUpdate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role", "details": err.Error()})
		return
	}

	// Ответ с успешным обновлением
	c.JSON(http.StatusOK, gin.H{
		"message": "User role updated successfully",
	})
}

// @Checks if the provided role is a valid user role
func isValidRole(role string) bool {
	switch models.UserRole(role) {
	case models.Admin, models.Moderator, models.Support, models.SimpleUser:
		return true
	default:
		return false
	}
}

// func isValidRole(role string) bool {
// 	switch role {
// 	case string(models.Admin), string(models.Moderator), string(models.Support), string(models.SimpleUser):
// 		return true
// 	default:
// 		return false
// 	}
// }

// @ Generate JWT Token for the CheckHandler
func generateToken(claims models.Claims) (string, error) {
	token := gjwt.NewWithClaims(gjwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// @ CheckHandler function
func CheckHandler(c *gin.Context) {
	// Get the token from the authorization header
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
		return
	}

	// Remove the "Bearer " prefix if present
	tokenString = strings.ReplaceAll(tokenString, "Bearer ", "")

	// Parse the token
	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(*models.Claims)
	if !ok || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Set user claims in the context
	c.Set("user", *claims)

	// Respond with the token
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// @Summary Удаление пользователя по ID
// @Description Удаляет пользователя по указанному идентификатору.
// @Tags users
// @Security CookieAuth
// @Param id path int true "ID пользователя"
// @Success 200 {string} string "User deleted successfully"
// @Failure 400 {string} string "Invalid user ID"
// @Failure 401 {string} string "Unauthorized"
// @Failure 403 {string} string "Access denied"
// @Failure 404 {string} string "User not found"
// @Failure 500 {string} string "Failed to delete user"
// @Router /api/users/{id} [delete]
func (u *UserHandler) DeleteUser(c *gin.Context) {
	// Get the user ID from the URL
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	fmt.Println("Deleting user with ID:", userID)

	// Proceed with the deletion logic
	var userToDelete models.User
	if err := u.DB.Unscoped().Where("id = ?", userID).First(&userToDelete).Error; err != nil {
		fmt.Println("Error fetching user:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Delete the user
	if err := u.DB.Unscoped().Delete(&userToDelete).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User and associated content deleted successfully"})
}

// @Summary Получение всех пользователей
// @Description Возвращает список всех пользователей.
// @Tags users
// @Security BasicAuth
// @Success 200 {array} models.User "Get all users successfully"
// @Failure 500 {string} string "Failed to get users"
// @Router /api/users [get]
func (u *UserHandler) GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := u.DB.Preload("Section").Preload("StroopResult").Preload("MBTI").Preload("BeckTestResult").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// @Summary Получение данных пользователя
// @Description Получает данные конкретного пользователя
// @Tags users
// @Security CookieAuth
// @Param id path int true "ID пользователя"
// @Success 200 {object} models.User "Данные пользователя успешно получены"
// @Failure 400 {string} string "Invalid user ID"
// @Failure 401 {string} string "Unauthorized"
// @Failure 403 {string} string "Access denied"
// @Failure 404 {string} string "User not found"
// @Failure 500 {string} string "Failed to get user"
// @Router /api/users/{id} [get]
func (u *UserHandler) GetUser(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := u.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	formattedBirthday, err := utils.ParseBirthday(user.Personal.BirthDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse birthday"})
		return
	}

	// Обновление даты рождения в структуре пользователя
	user.Personal.BirthDate = formattedBirthday

	//@ Preload other data
	if err := u.DB.Preload("Section").Preload("StroopResult").Preload("MBTI").Preload("BeckTestResult").Find(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary Защищенная страница, требующая авторизации и роли "admin"
// @Description Возвращает сообщение "Dashboard page"
// @Description Проверка работоспособности middleware AuthMiddleware
// @Tags users
// @Security BasicAuth
// @Security RolesAuth
// @Success 200 {string} string "Dashboard page"
// @Failure 401 {string} string "Unauthorized"
// @Failure 403 {string} string "Access denied"
// @Router /auth/dashboard [get]
func (u *UserHandler) Dashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Dashboard page"})
}
