package handlers

import (
	"TimeWise/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TaskHandler содержит зависимости для работы с задачами
type TaskHandler struct {
	DB *gorm.DB
}

// GetTasks возвращает все задачи пользователя
func (h *TaskHandler) GetTasks(c *gin.Context) {
	userID, _ := strconv.Atoi(c.Param("id"))
	var tasks []models.Task
	if result := h.DB.Where("user_id = ?", userID).Find(&tasks); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// CreateTask создаёт новую задачу для пользователя
func (h *TaskHandler) CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if result := h.DB.Create(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

// UpdateTask обновляет существующую задачу
func (h *TaskHandler) UpdateTask(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("taskID"))
	var task models.Task
	if result := h.DB.First(&task, taskID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := h.DB.Save(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

// DeleteTask удаляет задачу
func (h *TaskHandler) DeleteTask(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("taskID"))
	if result := h.DB.Delete(&models.Task{}, taskID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
