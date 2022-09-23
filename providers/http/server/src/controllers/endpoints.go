package controllers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"providers/http/server/src/models"
)

// POST /save
func Save(c *gin.Context) {
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

	res, err := http.Get(saveReq.Resource.Properties.RequestUri)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedResource := saveReq.Resource
	updatedResource.Properties.Status = res.Status
	updatedResource.Properties.StatusCode = res.StatusCode

	c.JSON(http.StatusOK, gin.H{"resource": updatedResource})
}

// POST /previewSave
func PreviewSave(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{"resource": saveReq.Resource})
}

func validateRequest(req models.SaveRequest) error {
	if req.Resource.Properties.Method != "" && strings.ToUpper(req.Resource.Properties.Method) != http.MethodGet {
		return errors.New("only GET method is supported")
	}

	if req.Resource.Properties.RequestUri == "" {		
		return errors.New("requestUri cannot be empty")
	}

	return nil
}
