package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"providers/http/server/src/controllers"
)

func main() {
	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "hello world"})
	})

	router.GET("/endpoints", controllers.FindEndpoints)

	router.Run(":3000")
}
