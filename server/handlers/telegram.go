package handlers

import (
	"TimeWise/pkg/vars"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type ContactForm struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func (u *UserHandler) SendMessage(c *gin.Context) {
	var formData ContactForm
	if err := c.ShouldBindJSON(&formData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
		return
	}
	sendMessageToTelegram(formData)
	c.JSON(http.StatusOK, gin.H{"message": "Message sent to Telegram"})
}

func sendMessageToTelegram(data ContactForm) {
	text := fmt.Sprintf("Имя: %s\nEmail: %s\nТема: %s\nСообщение: %s",
		data.Name, data.Email, data.Subject, data.Message)

	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s",
		vars.BOT_TOKEN, vars.CHAT_ID, url.QueryEscape(text))

	http.Get(apiURL)
}
