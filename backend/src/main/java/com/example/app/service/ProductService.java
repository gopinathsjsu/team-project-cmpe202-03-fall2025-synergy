package com.example.app.service;

import com.example.app.dto.PaginatedResponse;
import com.example.app.model.Product;
import com.example.app.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
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
        // Use native query to avoid vector type conversion issues
        String selectSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at " +
                          "FROM products WHERE status = :status";
        
        Query query = entityManager.createNativeQuery(selectSql);
        query.setParameter("status", "ACTIVE");
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();
        
        return results.stream().map(row -> {
            Product product = new Product();
            product.setId(((Number) row[0]).longValue());
            product.setName((String) row[1]);
            product.setDescription((String) row[2]);
            product.setPrice((java.math.BigDecimal) row[3]);
            product.setCategory((String) row[4]);
            product.setCondition((String) row[5]);
            product.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
            product.setImageUrl((String) row[7]);
            product.setStatus((String) row[8]);
            if (row[9] != null) {
                product.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
            }
            if (row[10] != null) {
                product.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
            }
            product.setEmbedding(null); // Not needed in response
            return product;
        }).toList();
    }
    
    /**
     * Get products with pagination (fetches all products from products table)
     * @param page Zero-based page index
     * @param size Number of items per page
     * @return Paginated response with products
     */
    public PaginatedResponse<Product> getActiveProductsPaginated(int page, int size) {
        // Validate and set defaults
        if (page < 0) page = 0;
        if (size < 1) size = 10;
        if (size > 100) size = 100; // Max page size
        
        // Get total count from products table
        String countSql = "SELECT COUNT(*) FROM products";
        Query countQuery = entityManager.createNativeQuery(countSql);
        Long totalElements = ((Number) countQuery.getSingleResult()).longValue();
        
        // Get paginated results from products table
        String selectSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at " +
                          "FROM products " +
                          "ORDER BY COALESCE(created_at, updated_at, CURRENT_TIMESTAMP) DESC " +
                          "LIMIT :limit OFFSET :offset";
        
        Query query = entityManager.createNativeQuery(selectSql);
        query.setParameter("limit", size);
        query.setParameter("offset", page * size);
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();
        
        System.out.println("[ProductService] Found " + results.size() + " products in database (page: " + page + ", size: " + size + ")");
        
        List<Product> products = results.stream().map(row -> {
            Product product = new Product();
            product.setId(((Number) row[0]).longValue());
            product.setName((String) row[1]);
            product.setDescription((String) row[2]);
            product.setPrice((java.math.BigDecimal) row[3]);
            product.setCategory((String) row[4]);
            product.setCondition((String) row[5]);
            product.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
            product.setImageUrl((String) row[7]);
            product.setStatus((String) row[8]);
            if (row[9] != null) {
                product.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
            }
            if (row[10] != null) {
                product.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
            }
            product.setEmbedding(null); // Not needed in response
            return product;
        }).toList();
        
        System.out.println("[ProductService] Mapped " + products.size() + " products. Total elements: " + totalElements);
        
        return new PaginatedResponse<>(products, page, size, totalElements);
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
        
        // Use native query to insert with vector type
        String insertSql = "INSERT INTO products (name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at, embedding) " +
                          "VALUES (:name, :description, :price, :category, :condition, :sellerId, :imageUrl, :status, :createdAt, :updatedAt, CAST(:embedding AS vector)) " +
                          "RETURNING id";
        
        Query query = entityManager.createNativeQuery(insertSql);
        query.setParameter("name", product.getName());
        query.setParameter("description", product.getDescription());
        query.setParameter("price", product.getPrice());
        query.setParameter("category", product.getCategory());
        query.setParameter("condition", product.getCondition());
        query.setParameter("sellerId", product.getSellerId());
        query.setParameter("imageUrl", product.getImageUrl());
        query.setParameter("status", product.getStatus() != null ? product.getStatus() : "ACTIVE");
        query.setParameter("createdAt", LocalDateTime.now());
        query.setParameter("updatedAt", LocalDateTime.now());
        query.setParameter("embedding", embeddingString);
        
        Long id = ((Number) query.getSingleResult()).longValue();
        
        // Fetch and return the created product using native query to handle vector type
        String selectSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at, " +
                          "CAST(embedding AS text) as embedding_text FROM products WHERE id = :id";
        
        Query selectQuery = entityManager.createNativeQuery(selectSql);
        selectQuery.setParameter("id", id);
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = selectQuery.getResultList();
        
        if (results.isEmpty()) {
            throw new RuntimeException("Failed to create product");
        }
        
        Object[] row = results.get(0);
        Product createdProduct = new Product();
        createdProduct.setId(((Number) row[0]).longValue());
        createdProduct.setName((String) row[1]);
        createdProduct.setDescription((String) row[2]);
        createdProduct.setPrice((java.math.BigDecimal) row[3]);
        createdProduct.setCategory((String) row[4]);
        createdProduct.setCondition((String) row[5]);
        createdProduct.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
        createdProduct.setImageUrl((String) row[7]);
        createdProduct.setStatus((String) row[8]);
        if (row[9] != null) {
            createdProduct.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
        }
        if (row[10] != null) {
            createdProduct.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
        }
        // Set embedding as null since we don't need it in the response
        createdProduct.setEmbedding(null);
        
        return createdProduct;
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
            
            // Use native query to update with vector type
            String updateSql = "UPDATE products SET " +
                              "name = :name, " +
                              "description = :description, " +
                              "price = :price, " +
                              "category = :category, " +
                              "condition = :condition, " +
                              "image_url = :imageUrl, " +
                              "status = :status, " +
                              "updated_at = :updatedAt, " +
                              "embedding = CAST(:embedding AS vector) " +
                              "WHERE id = :id";
            
            Query query = entityManager.createNativeQuery(updateSql);
            query.setParameter("id", id);
            query.setParameter("name", product.getName());
            query.setParameter("description", product.getDescription());
            query.setParameter("price", product.getPrice());
            query.setParameter("category", product.getCategory());
            query.setParameter("condition", product.getCondition());
            query.setParameter("imageUrl", product.getImageUrl());
            query.setParameter("status", product.getStatus());
            query.setParameter("updatedAt", LocalDateTime.now());
            query.setParameter("embedding", embeddingString);
            query.executeUpdate();
            
            // Fetch and return the updated product using native query to handle vector type
            String selectSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at, " +
                              "CAST(embedding AS text) as embedding_text FROM products WHERE id = :id";
            
            Query selectQuery = entityManager.createNativeQuery(selectSql);
            selectQuery.setParameter("id", id);
            
            @SuppressWarnings("unchecked")
            List<Object[]> results = selectQuery.getResultList();
            
            if (results.isEmpty()) {
                throw new RuntimeException("Product not found with id: " + id);
            }
            
            Object[] row = results.get(0);
            Product updatedProduct = new Product();
            updatedProduct.setId(((Number) row[0]).longValue());
            updatedProduct.setName((String) row[1]);
            updatedProduct.setDescription((String) row[2]);
            updatedProduct.setPrice((java.math.BigDecimal) row[3]);
            updatedProduct.setCategory((String) row[4]);
            updatedProduct.setCondition((String) row[5]);
            updatedProduct.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
            updatedProduct.setImageUrl((String) row[7]);
            updatedProduct.setStatus((String) row[8]);
            if (row[9] != null) {
                updatedProduct.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
            }
            if (row[10] != null) {
                updatedProduct.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
            }
            // Set embedding as null since we don't need it in the response
            updatedProduct.setEmbedding(null);
            
            return updatedProduct;
        } else {
            // No embedding update needed, use regular save
            return productRepository.save(product);
        }
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
        
        // First, check if any products have embeddings
        String countSql = "SELECT COUNT(*) FROM products WHERE embedding IS NOT NULL AND status = :status";
        Query countQuery = entityManager.createNativeQuery(countSql);
        countQuery.setParameter("status", "ACTIVE");
        Long embeddingCount = ((Number) countQuery.getSingleResult()).longValue();
        
        // If no products have embeddings, fall back to keyword search
        if (embeddingCount == 0) {
            return keywordSearch(query, searchLimit);
        }
        
        // Generate embedding for the search query
        List<Float> queryEmbedding = embeddingService.generateEmbedding(query.trim());
        String queryEmbeddingString = embeddingService.embeddingToString(queryEmbedding);
        
        // Use native query to avoid vector type conversion issues
        // Using cosine distance (<->) - lower is more similar
        // Include distance in SELECT to filter by similarity threshold
        String searchSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at, " +
                          "embedding <-> CAST(:queryEmbedding AS vector) as distance " +
                          "FROM products " +
                          "WHERE embedding IS NOT NULL AND status = :status " +
                          "ORDER BY embedding <-> CAST(:queryEmbedding AS vector) " +
                          "LIMIT :limit";
        
        Query searchQuery = entityManager.createNativeQuery(searchSql);
        searchQuery.setParameter("queryEmbedding", queryEmbeddingString);
        searchQuery.setParameter("status", "ACTIVE");
        searchQuery.setParameter("limit", searchLimit);
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = searchQuery.getResultList();
        
        // Filter results by similarity threshold
        // Cosine distance ranges from 0 (identical) to 2 (opposite)
        // Based on actual distances: "Bottled Water" ~1.04, "iphone" ~1.37
        // Setting threshold to 1.2 to include relevant results while filtering out unrelated ones
        double similarityThreshold = 1.2;
        
        return results.stream()
            .filter(row -> {
                // Distance is at index 11
                if (row.length > 11 && row[11] != null) {
                    Double distance = ((Number) row[11]).doubleValue();
                    // Log distance for debugging (can remove in production)
                    // System.out.println("Product distance: " + distance + " for query: " + query);
                    return distance < similarityThreshold;
                }
                // If distance is missing, include it (shouldn't happen, but safe fallback)
                return true;
            })
            .map(row -> {
                Product product = new Product();
                product.setId(((Number) row[0]).longValue());
                product.setName((String) row[1]);
                product.setDescription((String) row[2]);
                product.setPrice((java.math.BigDecimal) row[3]);
                product.setCategory((String) row[4]);
                product.setCondition((String) row[5]);
                product.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
                product.setImageUrl((String) row[7]);
                product.setStatus((String) row[8]);
                if (row[9] != null) {
                    product.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
                }
                if (row[10] != null) {
                    product.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
                }
                product.setEmbedding(null); // Not needed in response
                
                // Calculate match percentage from cosine distance
                // Cosine distance ranges from 0 (identical) to 2 (opposite)
                // Match percentage = (1 - (distance / 2)) * 100
                if (row.length > 11 && row[11] != null) {
                    Double distance = ((Number) row[11]).doubleValue();
                    Double matchPercentage = Math.max(0.0, Math.min(100.0, (1.0 - (distance / 2.0)) * 100.0));
                    product.setMatchPercentage(Math.round(matchPercentage * 10.0) / 10.0); // Round to 1 decimal place
                } else {
                    product.setMatchPercentage(null);
                }
                
                return product;
            })
            .toList();
    }
    
    /**
     * Keyword-based search fallback when embeddings are not available
     */
    private List<Product> keywordSearch(String query, int limit) {
        String searchTerm = "%" + query.toLowerCase() + "%";
        String keywordSql = "SELECT id, name, description, price, category, condition, seller_id, image_url, status, created_at, updated_at " +
                           "FROM products " +
                           "WHERE status = :status " +
                           "AND (LOWER(name) LIKE :searchTerm OR LOWER(description) LIKE :searchTerm OR LOWER(category) LIKE :searchTerm) " +
                           "LIMIT :limit";
        
        Query keywordQuery = entityManager.createNativeQuery(keywordSql);
        keywordQuery.setParameter("status", "ACTIVE");
        keywordQuery.setParameter("searchTerm", searchTerm);
        keywordQuery.setParameter("limit", limit);
        
        @SuppressWarnings("unchecked")
        List<Object[]> results = keywordQuery.getResultList();
        
        return results.stream().map(row -> {
            Product product = new Product();
            product.setId(((Number) row[0]).longValue());
            product.setName((String) row[1]);
            product.setDescription((String) row[2]);
            product.setPrice((java.math.BigDecimal) row[3]);
            product.setCategory((String) row[4]);
            product.setCondition((String) row[5]);
            product.setSellerId(row[6] != null ? ((Number) row[6]).longValue() : null);
            product.setImageUrl((String) row[7]);
            product.setStatus((String) row[8]);
            if (row[9] != null) {
                product.setCreatedAt(((java.sql.Timestamp) row[9]).toLocalDateTime());
            }
            if (row[10] != null) {
                product.setUpdatedAt(((java.sql.Timestamp) row[10]).toLocalDateTime());
            }
            product.setEmbedding(null);
            return product;
        }).toList();
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

