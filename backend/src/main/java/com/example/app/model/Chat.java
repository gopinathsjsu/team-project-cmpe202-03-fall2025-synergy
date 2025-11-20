package com.example.app.model;

import java.time.OffsetDateTime;
import jakarta.persistence.*;

@Entity
@Table(
  name = "chats",
  uniqueConstraints = @UniqueConstraint(columnNames = {"product_id","buyer_id","seller_id"})
)
public class Chat {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Java property names (camelCase)
  @Column(name = "product_id", nullable = false)
  private Long productId;

  @Column(name = "buyer_id", nullable = false)
  private Long buyerId;

  @Column(name = "seller_id", nullable = false)
  private Long sellerId;

  // Fix typos and align names
  @Column(name = "create_audit_time", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "update_audit_time", nullable = false)
  private OffsetDateTime updatedAt;

  @PrePersist
  void onCreate() {
    OffsetDateTime now = OffsetDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = OffsetDateTime.now();
  }

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getProductId() { return productId; }
  public void setProductId(Long productId) { this.productId = productId; }

  public Long getBuyerId() { return buyerId; }
  public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

  public Long getSellerId() { return sellerId; }
  public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
