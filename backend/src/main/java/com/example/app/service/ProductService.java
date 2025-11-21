package com.example.app.service;

import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    private static final int DEFAULT_SEARCH_LIMIT = 10;
    
    /**
     * Get all products
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    /**
     * Get product by ID
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    /**
     * Get active products
     */
    public List<Product> getActiveProducts() {
        return productRepository.findByStatus("ACTIVE");
    }
    
    /**
     * Get products by category
     */
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    /**
     * Get products by seller
     */
    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
    
    /**
     * Create a new product and generate its embedding
     */
    @Transactional
    public Product createProduct(Product product) {
        // Generate embedding from name + description
        String textForEmbedding = buildTextForEmbedding(product.getName(), product.getDescription());
        List<Float> embedding = embeddingService.generateEmbedding(textForEmbedding);
        String embeddingString = embeddingService.embeddingToString(embedding);
        product.setEmbedding(embeddingString);
        
        return productRepository.save(product);
    }
    
    /**
     * Update a product and regenerate its embedding if name or description changed
     */
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        boolean needsEmbeddingUpdate = false;
        
        if (productDetails.getName() != null && !productDetails.getName().equals(product.getName())) {
            product.setName(productDetails.getName());
            needsEmbeddingUpdate = true;
        }
        
        if (productDetails.getDescription() != null && !productDetails.getDescription().equals(product.getDescription())) {
            product.setDescription(productDetails.getDescription());
            needsEmbeddingUpdate = true;
        }
        
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }
        
        if (productDetails.getCondition() != null) {
            product.setCondition(productDetails.getCondition());
        }
        
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        
        if (productDetails.getStatus() != null) {
            product.setStatus(productDetails.getStatus());
        }
        
        // Regenerate embedding if name or description changed
        if (needsEmbeddingUpdate) {
            String textForEmbedding = buildTextForEmbedding(product.getName(), product.getDescription());
            List<Float> embedding = embeddingService.generateEmbedding(textForEmbedding);
            String embeddingString = embeddingService.embeddingToString(embedding);
            product.setEmbedding(embeddingString);
        }
        
        return productRepository.save(product);
    }
    
    /**
     * Delete a product
     */
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    /**
     * Semantic search for products
     * 
     * @param query The search query text
     * @param limit Maximum number of results (default: 10)
     * @return List of products ordered by similarity
     */
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String query, Integer limit) {
        if (query == null || query.trim().isEmpty()) {
            return getActiveProducts();
        }
        
        int searchLimit = (limit != null && limit > 0) ? limit : DEFAULT_SEARCH_LIMIT;
        
        // Generate embedding for the search query
        List<Float> queryEmbedding = embeddingService.generateEmbedding(query.trim());
        String queryEmbeddingString = embeddingService.embeddingToString(queryEmbedding);
        
        // Perform similarity search
        return productRepository.findSimilarProductsByStatus(queryEmbeddingString, "ACTIVE", searchLimit);
    }
    
    /**
     * Build text for embedding generation from product name and description
     */
    private String buildTextForEmbedding(String name, String description) {
        StringBuilder sb = new StringBuilder();
        
        if (name != null && !name.trim().isEmpty()) {
            sb.append(name.trim());
        }
        
        if (description != null && !description.trim().isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" ");
            }
            sb.append(description.trim());
        }
        
        return sb.toString();
    }
}

