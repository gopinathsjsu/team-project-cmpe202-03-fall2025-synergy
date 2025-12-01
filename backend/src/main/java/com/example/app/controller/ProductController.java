package com.example.app.controller;

import com.example.app.dto.ProductResponseDto;
import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import com.example.app.service.ProductService;
import com.example.app.util.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;
    
    /**
     * Get all products - returns all products from database (no pagination, no filtering)
     * GET /api/products
     */
    @GetMapping
    public List<ProductResponseDto> getAllProducts() {
        logger.info("GET /api/products - Fetching all products from database");
        List<Product> products = productRepository.findAll();
        logger.info("Returning {} products", products.size());
        return products.stream()
                .map(ProductMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get active products
     */
    @GetMapping("/active")
    public ResponseEntity<List<ProductResponseDto>> getActiveProducts() {
        List<Product> products = productService.getActiveProducts();
        List<ProductResponseDto> dtos = products.stream()
                .map(ProductMapper::toResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        logger.info("GET /api/products/{} - Fetching product by ID", id);
        try {
            Optional<Product> product = productRepository.findById(id);
            if (product.isPresent()) {
                logger.info("Product found: {}", product.get().getName());
                return ResponseEntity.ok(ProductMapper.toResponseDto(product.get()));
            } else {
                logger.warn("Product not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching product by ID: {}", id, e);
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Semantic search endpoint
     * GET /api/products/search?q=<query>&limit=<limit>
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer limit) {
        try {
            List<Product> products = productService.searchProducts(q, limit);
            List<ProductResponseDto> dtos = products.stream()
                    .map(ProductMapper::toResponseDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Search failed: " + e.getMessage()));
        }
    }
    
    /**
     * Get products by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponseDto>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductResponseDto> dtos = products.stream()
                .map(ProductMapper::toResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get products by seller ID
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getProductsBySeller(@PathVariable Long sellerId) {
        logger.info("GET /api/products/seller/{} - Fetching products by seller ID", sellerId);
        try {
            List<Product> products = productService.getProductsBySeller(sellerId);
            logger.info("Returning {} products for seller {}", products.size(), sellerId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products by seller ID: {}", sellerId, e);
            return ResponseEntity.status(500)
                    .body(List.of());
        }
    }
    
    /**
     * Create a new product
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(ProductMapper.toResponseDto(createdProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create product: " + e.getMessage()));
        }
    }
    
    /**
     * Update a product
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(ProductMapper.toResponseDto(updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to update product: " + e.getMessage()));
        }
    }
    
    /**
     * Delete a product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}

