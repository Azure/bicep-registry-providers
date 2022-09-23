package controllers

import (
	"errors"
	"net/http"
	"strings"

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

	err := validateRequest(saveReq)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := http.Get(saveReq.Resource.Properties.URL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	saveResponse := models.SaveResponse{
		Status:     res.Status,
		StatusCode: res.StatusCode,
	}

	c.JSON(http.StatusOK, gin.H{"data": saveResponse})
}

func validateRequest(req models.SaveRequest) error {
	if req.Resource.Properties.Method != "" && strings.ToUpper(req.Resource.Properties.Method) != http.MethodGet {
		return errors.New("only GET method is supported")
	}

	if req.Resource.Properties.URL == "" {
		return errors.New("url cannot be empty")
	}

	return nil
}
