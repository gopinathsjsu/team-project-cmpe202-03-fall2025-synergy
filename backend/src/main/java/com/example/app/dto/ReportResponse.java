package com.example.app.dto;

import java.time.LocalDateTime;

public class ReportResponse {
    
    private Long id;
    private Long productId;
    private String reason;
    private Boolean status;
    private Long createAuditId;
    private LocalDateTime createAuditTime;
    
    public ReportResponse() {}
    
    public ReportResponse(Long id, Long productId, String reason, Boolean status, Long createAuditId, LocalDateTime createAuditTime) {
        this.id = id;
        this.productId = productId;
        this.reason = reason;
        this.status = status;
        this.createAuditId = createAuditId;
        this.createAuditTime = createAuditTime;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Boolean getStatus() {
        return status;
    }
    
    public void setStatus(Boolean status) {
        this.status = status;
    }
    
    public Long getCreateAuditId() {
        return createAuditId;
    }
    
    public void setCreateAuditId(Long createAuditId) {
        this.createAuditId = createAuditId;
    }
    
    public LocalDateTime getCreateAuditTime() {
        return createAuditTime;
    }
    
    public void setCreateAuditTime(LocalDateTime createAuditTime) {
        this.createAuditTime = createAuditTime;
    }
}

