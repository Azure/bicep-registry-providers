package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"providers/http/server/src/models"
)

// GET /endpoints
// Get all endpoints
func FindEndpoints(c *gin.Context) {
	var endpoints []models.Endpoint

	c.JSON(http.StatusOK, gin.H{"data": endpoints})
}
