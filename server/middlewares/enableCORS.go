package middlewares

import (
	"TimeWise/pkg/vars"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func EnableCORS(r *gin.Engine) {
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{vars.ORIGIN_URL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "token", "*"},
		AllowCredentials: true,
	}))
}

// func EnableCORS(r *gin.Engine) {
// 	r.Use(cors.New(cors.Config{
// 			AllowOrigins:     []string{"https://mindharmony.ru", "https://www.mindharmony.ru", "https://mindharmony.ru:443", "https://www.mindharmony.ru/api/update-mbti-result/", "http://95.163.231.37:443", "https://95.163.231.37:443"},
// 			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
// 			AllowHeaders:     []string{"Content-Type", "Authorization", "token", "*"},
// 			AllowCredentials: true,
// 			ExposeHeaders:    []string{"Content-Length"},
// 	}))
// }
