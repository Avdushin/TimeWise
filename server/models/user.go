package models

import (
	"encoding/json"
	"time"

	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

type UserRole string

const (
	Admin      UserRole = "admin"
	Moderator  UserRole = "moderator"
	Support    UserRole = "support"
	SimpleUser UserRole = "user"
)

type GormModel struct {
	ID        uint `gorm:"primarykey" json:"id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type User struct {
	GormModel
	Auth     `json:"auth"`
	Personal `json:"personal"`
	Location `json:"location"`
	Tasks    []Task  `json:"tasks" gorm:"foreignKey:UserID"`
	Events   []Event `json:"events" gorm:"foreignKey:UserID"`
}

func (u *User) MarshalJSON() ([]byte, error) {
	id := u.GormModel.ID

	data := map[string]interface{}{
		"id":       id,
		"auth":     u.Auth,
		"personal": u.Personal,
		"location": u.Location,
		"tasks":    u.Tasks,
		"events":   u.Events,
	}

	return json.Marshal(data)
}

// Модель задач (TodoList)
type Task struct {
	GormModel
	UserID      uint       `json:"user_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	IsCompleted bool       `json:"is_completed"`
	DueDate     *time.Time `json:"due_date"`
}

// Модель событий (Events в календаре жизни)
type Event struct {
	GormModel
	UserID      uint   `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	EventDate   string `json:"event_date"` // d-m-y
	EventTime   string `json:"event_time"` // hh:mm
}

// Метод для парсинга даты события
func (e *Event) SetEventDate(t time.Time) {
	e.EventDate = t.Format("02-01-2006") // Форматирование в "день-месяц-год"
}

// Метод для парсинга времени события
func (e *Event) SetEventTime(t time.Time) {
	e.EventTime = t.Format("15:04") // Форматирование в "часы:минуты"
}

// Метод для получения даты события как time.Time
func (e *Event) GetEventDate() (time.Time, error) {
	return time.Parse("02-01-2006", e.EventDate)
}

// Метод для получения времени события как time.Time
func (e *Event) GetEventTime() (time.Time, error) {
	return time.Parse("15:04", e.EventTime)
}

type (
	// Авторизация
	Auth struct {
		Username string `json:"username"`
		Email    string `gorm:"unique_index;not null" json:"email"`
		Password string `json:"password,omitempty"`
		Role     string `gorm:"default:'user'" json:"role"`
	}
	// Личные данные
	Personal struct {
		Name        string `json:"name"`
		Surname     string `json:"surname"`
		Patronymic  string `json:"patronymic"`
		BirthDate   string `json:"birthday"`
		PhoneNumber string `json:"phone"`
	}
	// Локация
	Location struct {
		Country string `json:"country"`
		City    string `json:"city"`
	}
)

// JWT claims
type Claims struct {
	ID   uint `json:"id"`
	Auth struct {
		Username string `json:"username"`
		Email    string `gorm:"unique_index;not null" json:"email"`
		Password string `json:"password"`
		Role     string `gorm:"default:'user'" json:"role"`
	}
	Personal struct {
		Name        string `json:"name"`
		Surname     string `json:"surname"`
		Patronymic  string `json:"patronymic"`
		BirthDate   string `json:"birthday"`
		PhoneNumber string `json:"phone"`
	}
	Location struct {
		Country string `json:"country"`
		City    string `json:"city"`
	}
	Tasks  []Task  `json:"tasks"`
	Events []Event `json:"events"`
	jwt.StandardClaims
}

// Запрос на обновление пользователя
type UpdateUserRequest struct {
	Auth struct {
		Username string `json:"username"`
		Email    string `gorm:"unique_index;not null" json:"email"`
		Password string `json:"password,omitempty"`
		Role     string `gorm:"default:'user'" json:"role"`
	}
	Personal struct {
		Name        string `json:"name"`
		Surname     string `json:"surname"`
		Patronymic  string `json:"patronymic"`
		BirthDate   string `json:"birthday"`
		PhoneNumber string `json:"phone"`
	}
	Location struct {
		Country string `json:"country"`
		City    string `json:"city"`
	}
	PasswordChanged bool `json:"password_changed"`
}

// Запрос на изменение роли пользователя
type UpdateUserRoleRequest struct {
	NewRole string `json:"newRole" binding:"required" enums:"user,support,moderator,admin"`
}
