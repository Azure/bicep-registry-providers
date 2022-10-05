package models

type SaveRequest struct {
	Import   Import   `json:"import" binding:"required"`
	Resource Resource `json:"resource" binding:"required"`
}

type Import struct {
	Provider string `json:"provider" binding:"required"`
	Version  string `json:"version" binding:"required"`
}

type Resource struct {
	Type       string             `json:"type" binding:"required"`
	Properties ResourceProperties `json:"properties" binding:"required"`
}

type ResourceProperties struct {
	Uri    string `json:"uri" binding:"required"`
	Format string `json:"format"`
	SaveResponse
}

type SaveResponse struct {
	StatusCode int `json:"statusCode,omitempty"`
	Body       any `json:"body,omitempty"`
}
