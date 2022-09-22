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

// POST /Save
// Save an endpoint
func SaveEndpoint(c *gin.Context) {
	var saveReq models.SaveRequest
	if err := c.ShouldBindJSON(&saveReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": saveReq})
}
