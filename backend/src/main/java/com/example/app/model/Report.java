package com.example.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "listing_id", nullable = false)
    private Long listingId;
    
    @Column(name = "reason", nullable = false, length = 50)
    private String reason;
    
    @Column(name = "status")
    private Boolean status; // null = pending, true = resolved, false = rejected
    
    @Column(name = "create_audit_id", nullable = false)
    private Long createAuditId; // User who created the report
    
    @Column(name = "create_audit_time", nullable = false)
    private LocalDateTime createAuditTime;
    
    @PrePersist
    protected void onCreate() {
        if (createAuditTime == null) {
            createAuditTime = LocalDateTime.now();
        }
    }
    
    // Constructors
    public Report() {}
    
    public Report(Long productId, Long listingId, String reason, Long createAuditId) {
        this.productId = productId;
        this.listingId = listingId;
        this.reason = reason;
        this.createAuditId = createAuditId;
        this.status = null; // Pending by default
    }
    
    // Getters and Setters
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
    
    public Long getListingId() {
        return listingId;
    }
    
    public void setListingId(Long listingId) {
        this.listingId = listingId;
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

