package com.example.app.model;

import java.math.BigInteger;
import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "chats", uniqueConstraints = @UniqueConstraint(columnNames = {"product_id","buyer_id","seller_id"}))
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long product_id;

    @Column(name = "buyer_id", nullable = false)
    private Long buyer_id;

    @Column(name = "seller_id", nullable = false)
    private Long seller_id;

    @Column(name = "cretaed_at", nullable = false)
    private OffsetDateTime created_at = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime update_at = OffsetDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return product_id;
    }

    public void setProductId(Long productId) {
        this.product_id = productId;
    }

    public Long getBuyerId() {
        return buyer_id;
    }

    public void setBuyerId(Long buyerId) {
        this.buyer_id = buyerId;
    }

    public Long getSellerId() {
        return seller_id;
    }

    public void setSellerId(Long sellerId) {
        this.seller_id = sellerId;
    }

    public OffsetDateTime getCreatedAt() {
        return created_at;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.created_at = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return update_at;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.update_at = updatedAt;
    }
}
