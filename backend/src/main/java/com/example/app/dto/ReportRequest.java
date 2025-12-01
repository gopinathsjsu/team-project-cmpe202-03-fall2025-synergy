package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReportRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    public ReportRequest() {}
    
    public ReportRequest(Long productId, String reason) {
        this.productId = productId;
        this.reason = reason;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
}

