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

	// Установите userID из параметров контекста
	userID, _ := strconv.Atoi(c.Param("id"))
	task.UserID = uint(userID)

	if result := h.DB.Create(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Вернуть обновленный список задач
	var tasks []models.Task
	h.DB.Where("user_id = ?", userID).Find(&tasks)
	c.JSON(http.StatusOK, tasks)
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

	var tasks []models.Task
	h.DB.Where("user_id = ?", task.UserID).Find(&tasks)
	c.JSON(http.StatusOK, tasks)
}

// DeleteTask удаляет задачу
// DeleteTask удаляет задачу и возвращает обновленный список задач
func (h *TaskHandler) DeleteTask(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("taskID"))
	var task models.Task

	// Получаем задачу по ID
	if result := h.DB.First(&task, taskID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// Удаляем задачу
	if result := h.DB.Delete(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Вернуть обновленный список задач
	var tasks []models.Task
	h.DB.Where("user_id = ?", task.UserID).Find(&tasks)
	c.JSON(http.StatusOK, tasks)
}

// RecoverTask восстанавливает удалённую задачу
func (h *TaskHandler) RecoverTask(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("taskID"))
	var task models.Task

	// Ищем задачу с заданным ID, включая удаленные
	if result := h.DB.Unscoped().First(&task, taskID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// Восстанавливаем задачу
	if err := h.DB.Model(&task).Update("deleted_at", nil).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task recovered successfully", "task": task})
}

// CompleteTask завершает задачу
func (h *TaskHandler) CompleteTask(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("taskID"))
	var task models.Task

	if result := h.DB.First(&task, taskID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	task.IsCompleted = true
	// task.CompletedAt = time.Now()

	if result := h.DB.Save(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Вернуть обновленный список задач
	var tasks []models.Task
	h.DB.Where("user_id = ?", task.UserID).Find(&tasks)
	c.JSON(http.StatusOK, tasks)
}
