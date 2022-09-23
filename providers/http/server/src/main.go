package main

import (
	"github.com/gin-gonic/gin"

	"providers/http/server/src/controllers"
)

func main() {
	router := gin.Default()

	router.POST("/save", controllers.Save)
	router.POST("/previewSave", controllers.PreviewSave)

	router.Run(":8080")
}
