package com.example.app.util;

import com.example.app.dto.ProductResponseDto;
import com.example.app.model.Product;

/**
 * Utility class for mapping Product entity to Product DTOs
 */
public class ProductMapper {
    
    /**
     * Convert Product entity to ProductResponseDto
     * Ensures imageUrl is set based on category if not already present
     */
    public static ProductResponseDto toResponseDto(Product product) {
        if (product == null) {
            return null;
        }
        
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setCondition(product.getCondition());
        dto.setSellerId(product.getSellerId());
        
        // Ensure imageUrl is set - use existing if valid, otherwise generate from category
        String imageUrl = S3ImageUrlGenerator.ensureImageUrl(
            product.getImageUrl(), 
            product.getCategory(), 
            product.getId()
        );
        dto.setImageUrl(imageUrl);
        
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setMatchPercentage(product.getMatchPercentage());
        
        return dto;
    }
}

