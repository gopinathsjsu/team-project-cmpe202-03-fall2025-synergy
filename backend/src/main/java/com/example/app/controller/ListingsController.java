package com.example.app.controller;

import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ListingsController {
    
    private static final Logger logger = LoggerFactory.getLogger(ListingsController.class);
    
    @Autowired
    private ProductRepository productRepository;
    
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
}

