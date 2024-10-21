package handlers

import (
	"TimeWise/models"
	"TimeWise/pkg/email"
	"TimeWise/pkg/jwt"
	"TimeWise/pkg/vars"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// @Summary Запрос на восстановление пароля
// @Description Инициирует процесс восстановления пароля пользователя. Отправляет письмо с инструкциями и ссылкой на сброс пароля.
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.ForgotPasswordRequest true "Email пользователя"
// @Success 200 {object} swagger.SuccessResponse "Запрос на восстановление пароля отправлен успешно"
// @Failure 400 {string} string "Ошибка валидации запроса"
// @Failure 404 {string} string "Пользователь не найден"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /api/forgot-password [POST]
func (u *UserHandler) ForgotPassword(c *gin.Context) {
	var request models.ForgotPasswordRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{}
	if err := u.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	token, err := jwt.CreateToken(user)
	if err != nil {
		fmt.Println("Error generating token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	resetRequest := models.PasswordResetRequest{
		UserID:    user.GormModel.ID,
		Token:     token,
		ExpiresAt: time.Now().Add(time.Hour * 1),
	}

	tx := u.DB.Begin()
	if err := tx.Create(&resetRequest).Error; err != nil {
		fmt.Println("Error creating password reset request:", err)
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create password reset request"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		fmt.Println("Error committing transaction:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create password reset request"})
		return
	}

	fmt.Println("Password reset request created:", resetRequest)

	// Генерация URL для сброса пароля
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", vars.DOMAIN, resetRequest.Token)

	// Отправка письма
	err = sendPasswordResetEmail(user.Auth.Email, resetURL)
	if err != nil {
		fmt.Println("Error sending email:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send password reset email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent successfully"})
}

// @Summary Сброс пароля
// @Description Обновляет пароль пользователя после сброса. Требуется валидный токен сброса пароля.
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.ResetPasswordRequest true "Данные для сброса пароля"
// @Success 200 {object} swagger.SuccessResponse "Пароль успешно сброшен"
// @Failure 400 {string} string "Ошибка валидации запроса"
// @Failure 404 {string} string "Токен сброса пароля не найден или устарел"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /api/reset-password [POST]
func (u *UserHandler) ResetPassword(c *gin.Context) {
	var request models.ResetPasswordRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("NewPassword in request:", request.NewPassword)

	resetRequest := models.PasswordResetRequest{}
	fmt.Println("Token in request:", request.Token)
	if err := u.DB.Where("token = ? AND expires_at > ?", request.Token, time.Now()).First(&resetRequest).Error; err != nil {
		fmt.Println("Error finding reset request:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	fmt.Println("Reset request found:", resetRequest)

	user := models.User{}
	if err := u.DB.Where("id = ?", resetRequest.UserID).First(&user).Error; err != nil {
		fmt.Println("Error finding user:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error generating hashed password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate hashed password"})
		return
	}

	user.Auth.Password = string(hashedPassword)

	if err := u.DB.Save(&user).Error; err != nil {
		fmt.Println("Error updating user password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user password"})
		return
	}

	// TODO: Optionally, invalidate the used token

	c.JSON(http.StatusOK, gin.H{"message": "Пароль успешно сброшен"})
}

// @ Письмо с ссылкой на сброс пароля для пользователя...
func sendPasswordResetEmail(to, resetURL string) error {
	subject := "Восстановление пароля"
	body := fmt.Sprintf(`
	<html>
	<head>
		<style>
			body {
				font-family: 'Roboto', sans-serif;
				background-color: #f4f4f4;
				color: #333;
				margin: 0;
				padding: 0;
			}
			a {
				color: #ffffff;
				text-decoration: none;
			}
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				background-color: #fff;
				border-radius: 5px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			.header {
				background-color: #007BFF;
				color: #fff;
				text-align: center;
				padding: 10px;
				border-radius: 5px 5px 0 0;
			}
			.content {
				padding: 20px;
			}
			.link {
				color: #007BFF;
				text-decoration: none;
			}
			.button {
				display: flex;
				justify-content: center;
				width: 110px;
				margin: 0px auto;
				padding: 10px 20px;
				background-color: #007BFF;
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 5px;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h2>%s</h2>
				<hr />
				<p>Восстановление пароля</p>
			</div>
			<div class="content">
				<p>Для восстановления пароля перейдите по 
					<a href='%s' class="link">ссылке</a>.</p>
				<p>Если вы не запрашивали сброс пароля, проигнорируйте это сообщение.</p>
				<p>С уважением,<br>Команда %s</p>
				<a href='%s' class="button">
					<buton class="button" align="center">Сбросить пароль</buton>
				</a>
			</div>
		</div>
	</body>
	</html>
	`, vars.APP_NAME, resetURL, vars.APP_NAME, resetURL)

	return email.SendEmail(to, subject, body)
}
