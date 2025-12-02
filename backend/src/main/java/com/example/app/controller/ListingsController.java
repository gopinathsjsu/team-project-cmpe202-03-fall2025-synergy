package com.example.app.controller;

import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import com.example.app.service.ProductService;
import com.example.app.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/listings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ListingsController {
    
    private static final Logger logger = LoggerFactory.getLogger(ListingsController.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Get paginated listings (all products from database)
     * GET /api/listings?page=<pageNumber>&size=<pageSize>
     */
    @GetMapping
    public ResponseEntity<Page<Product>> getAllListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("GET /api/listings - page: {}, size: {}", page, size);
        try {
            // Create Pageable with sorting by created_at descending
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            // Fetch all products with pagination
            Page<Product> productsPage = productRepository.findAll(pageable);
            
            logger.info("Returning {} products (total: {}, pages: {})", 
                productsPage.getContent().size(), 
                productsPage.getTotalElements(), 
                productsPage.getTotalPages());
            
            return ResponseEntity.ok(productsPage);
        } catch (Exception e) {
            logger.error("Error fetching listings", e);
            throw e;
        }
    }
    
    /**
     * Delete a listing (alias for deleting a product)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }
            
            String token = authHeader.substring(7);
            
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            Long userId = jwtUtil.extractUserId(token);
            productService.deleteProduct(id, userId);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting listing {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete listing"));
        }
    }
}

