package database

import (
	"TimeWise/models"
	"TimeWise/pkg/vars"

	"github.com/Avdushin/gogger/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// @ Инициализация базы данных
func InitDB() {
	var err error
	dsn := vars.DB + " sslmode=disable TimeZone=Europe/Moscow"
	logger.Info("Database adres %s", dsn)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Error("Failed to connect to database:", err)
		panic("Failed to connect to database")
	}
}

// @ DataBase auto-migrate tables from structures...
// @ Таблицы: users, Section, MBTI, StroopResult
func SyncDB() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Event{})
	DB.AutoMigrate(&models.Task{})

	migrator := DB.Migrator()

	// Создаем таблицу password_reset_requests, если ее нет
	if !migrator.HasTable(&models.PasswordResetRequest{}) {
		if err := migrator.CreateTable(&models.PasswordResetRequest{}); err != nil {
			panic("Failed to create password_reset_requests table")
		}
	}

	// Создаем таблицу forgot_password_requests, если ее нет
	if !migrator.HasTable(&models.ForgotPasswordRequest{}) {
		if err := migrator.CreateTable(&models.ForgotPasswordRequest{}); err != nil {
			panic("Failed to create forgot_password_requests table")
		}
	}

	// Выполнение миграции для преобразования колонки answers из bytea в jsonb
	convertAnswersColumnToJSONB()

	logger.Info("✅ Tables has been migrated...")
}

// Выполняет миграцию для преобразования колонки answers из bytea в jsonb
func convertAnswersColumnToJSONB() {
	// Создание временной колонки для хранения данных в текстовом формате
	DB.Exec("ALTER TABLE beck_test_results ADD COLUMN temp_answers text")

	// Копирование данных из колонки answers в временную колонку
	DB.Exec("UPDATE beck_test_results SET temp_answers = encode(answers, 'escape')")

	// Удаление оригинальной колонки answers
	DB.Exec("ALTER TABLE beck_test_results DROP COLUMN answers")

	// Добавление новой колонки answers типа jsonb
	DB.Exec("ALTER TABLE beck_test_results ADD COLUMN answers jsonb")

	// Перенос данных обратно в колонку answers, преобразовав их в JSON
	DB.Exec("UPDATE beck_test_results SET answers = temp_answers::jsonb")

	// Удаление временной колонки
	DB.Exec("ALTER TABLE beck_test_results DROP COLUMN temp_answers")
}
