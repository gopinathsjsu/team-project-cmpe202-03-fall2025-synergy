package com.example.app.repository;

import com.example.app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByStatus(String status);
    
    List<Product> findByCategory(String category);
    
    List<Product> findBySellerId(Long sellerId);
    
    /**
     * Semantic similarity search using pgvector
     * Uses cosine distance (<->) to find the most similar products
     * 
     * @param queryEmbedding The embedding vector as a string representation (e.g., "[0.1, -0.4, ...]")
     * @param limit Maximum number of results to return
     * @return List of products ordered by similarity (most similar first)
     */
    @Query(value = 
        "SELECT * FROM products " +
        "WHERE embedding IS NOT NULL " +
        "ORDER BY embedding <-> CAST(:queryEmbedding AS vector) " +
        "LIMIT :limit",
        nativeQuery = true)
    List<Product> findSimilarProducts(@Param("queryEmbedding") String queryEmbedding, @Param("limit") int limit);
    
    /**
     * Semantic similarity search with status filter
     */
    @Query(value = 
        "SELECT * FROM products " +
        "WHERE embedding IS NOT NULL AND status = :status " +
        "ORDER BY embedding <-> CAST(:queryEmbedding AS vector) " +
        "LIMIT :limit",
        nativeQuery = true)
    List<Product> findSimilarProductsByStatus(
        @Param("queryEmbedding") String queryEmbedding, 
        @Param("status") String status,
        @Param("limit") int limit
    );
}

