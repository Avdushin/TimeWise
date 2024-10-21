package main

import (
	"TimeWise/cmd/app/version"
	"TimeWise/cmd/server"
	"TimeWise/pkg/database"
	"TimeWise/pkg/vars"
	"context"

	"github.com/Avdushin/gogger/logger"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gorm.io/gorm"
)

// @securityDefinitions.basic BasicAuth
// @in header
// @name Authorization

// @title           MindHarmony API Documentation
// @version         0.2
// @description     Documentation for MindHarmony API server
// @termsOfService  http://swagger.io/terms/

// ?contact.name   ITDOBRO
// ?contact.url    https://github.com/Avdushin

// @contact.name   API Support
// @contact.url    mailto:support@mindharmony.ru
// @contact.email  support@mindharmony.ru

// @host      localhost:4000
// @BasePath /

// @securityDefinitions.basic  BasicAuth

// @securityDefinitions.apiKey CookieAuth
// @in cookie
// @name token
// @type apiKey

var db *gorm.DB

func main() {
	// @ Контекст
	ctx := context.Background()

	go database.MakeDBDump(ctx)
	// @Start the server
	server.StartServer()
}

// @ Функция init выполняется один раз при первом вызове пакета
func init() {
	// @Init Logger
	logger.InitLogger()
	//@ Ежедневное создание .log файлов
	if vars.DAILY_LOGGING == "true" {
		logger.Log.CreateDailyLogFile()
	}
	//@ Start print for buty (so... why not?😅)
	version.Version()
	// @ Инициализация БД
	database.InitDB()
	// @ Миграция моделей
	database.SyncDB()
}
