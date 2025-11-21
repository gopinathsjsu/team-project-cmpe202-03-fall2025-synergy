package com.example.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {
    
    @Value("${embeddings.service.url:http://localhost:8001}")
    private String embeddingsServiceUrl;
    
    @Autowired
    private RestTemplate restTemplate;
    
    /**
     * Generate embedding for the given text using the embeddings service
     * 
     * @param text The text to generate embedding for
     * @return List of floats representing the embedding vector
     */
    public List<Float> generateEmbedding(String text) {
        try {
            String url = embeddingsServiceUrl + "/embed";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", text);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                url, request, (Class<Map<String, Object>>) (Class<?>) Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                List<Double> embeddingDoubles = (List<Double>) response.getBody().get("embedding");
                
                // Convert List<Double> to List<Float>
                return embeddingDoubles.stream()
                    .map(Double::floatValue)
                    .toList();
            } else {
                throw new RuntimeException("Failed to generate embedding: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error calling embeddings service: " + e.getMessage(), e);
        }
    }
    
    /**
     * Convert embedding list to string representation for PostgreSQL vector type
     * Format: "[0.1, -0.4, 0.2, ...]"
     */
    public String embeddingToString(List<Float> embedding) {
        if (embedding == null || embedding.isEmpty()) {
            return null;
        }
        
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.size(); i++) {
            if (i > 0) {
                sb.append(", ");
            }
            sb.append(embedding.get(i));
        }
        sb.append("]");
        
        return sb.toString();
    }
}

