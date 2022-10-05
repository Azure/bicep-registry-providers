package controllers

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

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

	body, statusCode, err := makeRequest(saveReq)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedResource := saveReq.Resource
	updatedResource.Properties.StatusCode = statusCode
	updatedResource.Properties.Body = body

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
	if req.Resource.Properties.Uri == "" {
		return errors.New("uri cannot be empty")
	}

	return nil
}

func makeRequest(saveReq models.SaveRequest) (any, int, error) {
	res, err := http.Get(saveReq.Resource.Properties.Uri)
	if err != nil {
		return nil, 0, err
	}

	var responseBody interface{}
	if saveReq.Resource.Properties.Format == "json" {
		bytes, err := io.ReadAll(res.Body)
		if err != nil {
			return nil, 0, err
		}

		err = json.Unmarshal(bytes, &responseBody)
		if err != nil {
			return nil, 0, err
		}
	} else if saveReq.Resource.Properties.Format == "raw" {
		bytes, err := io.ReadAll(res.Body)
		if err != nil {
			return nil, 0, err
		}
		responseBody = string(bytes)
	} else if saveReq.Resource.Properties.Format == "" {
		responseBody = nil
	} else {
		return nil, 0, errors.New("format option is unrecognized")
	}

	return responseBody, res.StatusCode, nil
}
