package routes

import (
	"TimeWise/handlers"
	"TimeWise/handlers/auth"
	"TimeWise/middlewares"
	_ "TimeWise/pkg/vars"

	docs "TimeWise/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @ Функция для настройки роутинга
func SetupRouter(a *auth.AuthHandler, u *handlers.UserHandler, t *handlers.TaskHandler, e *handlers.EventHandler) *gin.Engine {
	r := gin.Default()

	middlewares.EnableCORS(r)

	docs.SwaggerInfo.BasePath = "/"

	api := r.Group("/api")
	{
		//? Users
		api.GET("/users", u.GetAllUsers)
		api.GET("/users/:id", u.GetUser)
		api.DELETE("/users/:id", u.DeleteUser)
		api.PUT("/users/update/:id", u.UpdateUser)
		api.PUT("/users/update-role/:id", u.UpdateUserRole)
		//? Auth
		api.GET("/user/auth", handlers.CheckHandler)
		api.POST("/forgot-password", u.ForgotPassword)
		api.POST("/reset-password", u.ResetPassword)
		api.POST("/signup", a.Register)
		api.POST("/login", a.Login)
		api.GET("/logout", a.Logout)
		//? Tasks
		api.GET("/users/:id/tasks", t.GetTasks)
		api.POST("/users/:id/tasks", t.CreateTask)
		api.PUT("/tasks/:taskID", t.UpdateTask)
		api.DELETE("/tasks/:taskID", t.DeleteTask)
		//? Events
		api.GET("/users/:id/events", e.GetEvents)
		api.POST("/users/:id/events", e.CreateEvent)
		api.PUT("/events/:eventID", e.UpdateEvent)
		api.DELETE("/events/:eventID", e.DeleteEvent)

		//@ Telegram API
		api.POST("/send-message", u.SendMessage)

	}

	//@ Группа маршрутов, требующих авторизации и определенной роли
	authGroup := r.Group("/auth")
	{
		authGroup.Use(middlewares.AuthMiddleware())
		// authGroup.Use(isAdmin())
		authGroup.GET("/dashboard", u.Dashboard)
	}

	// @Swagger Docs
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	return r
}
