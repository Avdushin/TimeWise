package handlers

import (
	"TimeWise/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// EventHandler содержит зависимости для работы с событиями
type EventHandler struct {
	DB *gorm.DB
}

// GetEvents возвращает все события пользователя
func (h *EventHandler) GetEvents(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))
	var events []models.Event
	if result := h.DB.Where("user_id = ?", userID).Find(&events); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

// CreateEvent создаёт новое событие для пользователя
func (h *EventHandler) CreateEvent(c *gin.Context) {
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if result := h.DB.Create(&event); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, event)
}

// UpdateEvent обновляет существующее событие
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	eventID, _ := strconv.Atoi(c.Param("eventID"))
	var event models.Event
	if result := h.DB.First(&event, eventID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := h.DB.Save(&event); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, event)
}

// DeleteEvent удаляет событие
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	eventID, _ := strconv.Atoi(c.Param("eventID"))
	if result := h.DB.Delete(&models.Event{}, eventID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}
