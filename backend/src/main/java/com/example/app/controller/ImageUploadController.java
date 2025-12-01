package com.example.app.controller;

import com.example.app.service.S3Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/images")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ImageUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(ImageUploadController.class);
    
    @Autowired
    private S3Service s3Service;
    
    /**
     * Upload an image to S3
     * POST /api/images/upload
     * 
     * @param file The image file to upload
     * @param category Optional category for folder organization
     * @return JSON with imageUrl
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category) {
        
        try {
            logger.info("Received image upload request: filename={}, size={}, category={}", 
                    file.getOriginalFilename(), file.getSize(), category);
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File is empty"));
            }
            
            // Validate file size (max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File size exceeds 10MB limit"));
            }
            
            // Upload to S3
            String imageUrl = s3Service.uploadImage(file, category);
            
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            logger.info("Image uploaded successfully: {}", imageUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid file: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            logger.error("Error uploading image", e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error uploading image", e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
}

