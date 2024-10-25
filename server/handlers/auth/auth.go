package auth

import (
	"TimeWise/models"
	password "TimeWise/pkg/Password"
	"TimeWise/pkg/jwt"
	"TimeWise/pkg/vars"
	"errors"
	"net/http"

	"github.com/Avdushin/gogger/logger"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB *gorm.DB
}

// @Summary Регистрация пользователя
// @Description Регистрирует пользователя с ролью по-умолчанию (user)
// @Tags auth
// @Accept json
// @Produce json
// @Request json
// @Param request body swagger.AuthRequest true "Данные для входа"
// @Success 201 {string} string "Пользователь успешно зарегистрирован"
// @Failure 400 {string} string "Ошибка при регистрации пользователя"
// @Router /api/signup [POST]
func (u *AuthHandler) Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка при регистрации пользователя"})
		return
	}
	// fmt.Printf("Received user data: %+v\n", user)

	var existingUser models.User
	if err := u.DB.Where("email = ?", user.Auth.Email).First(&existingUser).Error; err == nil {
		logger.Warning("User with email %s already exists\n", user.Auth.Email)
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		logger.Error("Failed to check email existence: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email existence"})
		return
	}

	//@ Хеширование пароля
	hashedPassword, err := password.HashPassword(user.Auth.Password)
	if err != nil {
		// fmt.Printf("Failed to hash password: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Auth.Password = hashedPassword
	user.Auth.Role = string(models.SimpleUser)

	if user.Auth.Role == "" {
		user.Auth.Role = string(models.SimpleUser)
	}

	// Создание пользователя
	u.DB.Create(&user)

	// fmt.Printf("Пользователь успешно зарегистрирован: %+v\n", user)
	c.JSON(http.StatusCreated, gin.H{"message": "Пользователь успешно зарегистрирован"})
}

// @Summary Авторизация пользователя
// @Description Авторизация пользователя и выдача JWT токена с использованием Cookie
// @Tags auth
// @Accept json
// @Produce json
// @Request json
// @Param request body swagger.AuthRequest true "Данные для входа"
// @Success 200 {object} swagger.SuccessResponse "Успешная авторизация"
// @Failure 400 {string} string "Ошибка авторизации пользователя"
// @Router /api/login [POST]
func (u *AuthHandler) Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка авторизации пользователя"})
		return
	}

	// Поиск пользователя по email
	var dbUser models.User
	if err := u.DB.Where("email = ?", user.Auth.Email).First(&dbUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query user"})
		return
	}

	// Проверка пароля
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Auth.Password), []byte(user.Auth.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":    "Invalid credentials",
			"dbpass":   []byte(dbUser.Auth.Password),
			"password": []byte(user.Auth.Password)})
		return
	}

	// Создание токена
	token, err := jwt.CreateToken(dbUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Установка токена в Cookie
	// c.SetCookie("token", token, int((time.Hour * 24 * 30).Seconds()), "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{
		"message": "Успешная авторизация",
		"token":   token,
	})
}

// @Summary Выход пользователя (Logout)
// @Description Завершение сеанса пользователя и удаление JWT токена из Cookie
// @Tags auth
// @Produce json
// @Success 200 {string} string "Успешный выход"
// @Router /api/logout [GET]
func (u *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func CreateAdmin(db *gorm.DB) {
	// Проверка наличия пользователя с ролью администратора
	var adminUser models.User
	result := db.Where("role = ?", string(models.Admin)).First(&adminUser)
	if result.Error == nil {
		logger.Info("🕵️  Admin user already exists.")
		return
	}

	// Хешируем пароль
	hashedPassword, err := password.HashPassword(vars.ADMIN_PASS)
	if err != nil {
		logger.Error("Failed to hash admin password:", err)
		return
	}

	// Создаём администратора
	newAdmin := models.User{
		Auth: models.Auth{
			Email:    vars.ADMIN_EMAIL,
			Role:     string(models.Admin),
			Password: hashedPassword,
		},
	}

	if err := db.Create(&newAdmin).Error; err != nil {
		logger.Error("🔪🕵️  Failed to create admin user:", err)
		return
	}

	logger.Debug("🕵️  Admin user created successfully...")
}
