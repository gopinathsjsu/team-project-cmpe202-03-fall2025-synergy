package com.example.app.util;

/**
 * Utility class to generate S3 image URLs based on product category
 */
public class S3ImageUrlGenerator {
    
    private static final String S3_BUCKET_NAME = "spartan-exchange-s3";
    private static final String S3_BASE_URL = "https://" + S3_BUCKET_NAME + ".s3.amazonaws.com";
    private static final String DEFAULT_IMAGE_EXTENSION = ".jpg";
    
    /**
     * Generate S3 image URL based on category and product identifier
     * Format: https://spartan-exchange-s3.s3.amazonaws.com/{category}/{fileName}
     * 
     * @param category Product category (e.g., "electronics", "textbooks", "furniture", "gaming")
     * @param productId Product ID to use as filename
     * @return S3 URL for the product image
     */
    public static String generateImageUrl(String category, Long productId) {
        if (category == null || category.trim().isEmpty()) {
            category = "default";
        }
        
        // Normalize category to lowercase
        String normalizedCategory = category.toLowerCase().trim();
        
        // Use product ID as filename
        String fileName = productId + DEFAULT_IMAGE_EXTENSION;
        
        // Construct URL: https://spartan-exchange-s3.s3.amazonaws.com/{category}/{fileName}
        return S3_BASE_URL + "/" + normalizedCategory + "/" + fileName;
    }
    
    /**
     * Generate S3 image URL based on category and product name
     * Format: https://spartan-exchange-s3.s3.amazonaws.com/{category}/{normalizedName}.jpg
     * 
     * @param category Product category
     * @param productName Product name (will be normalized to filename)
     * @return S3 URL for the product image
     */
    public static String generateImageUrlFromName(String category, String productName) {
        if (category == null || category.trim().isEmpty()) {
            category = "default";
        }
        
        // Normalize category to lowercase
        String normalizedCategory = category.toLowerCase().trim();
        
        // Normalize product name to filename
        String normalizedName = normalizeToFileName(productName);
        String fileName = normalizedName + DEFAULT_IMAGE_EXTENSION;
        
        // Construct URL
        return S3_BASE_URL + "/" + normalizedCategory + "/" + fileName;
    }
    
    /**
     * Normalize product name to a valid filename
     * Removes special characters, converts to lowercase, replaces spaces with hyphens
     */
    private static String normalizeToFileName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "product";
        }
        
        // Convert to lowercase, replace spaces and special chars with hyphens
        String normalized = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters
                .replaceAll("\\s+", "-") // Replace spaces with hyphens
                .replaceAll("-+", "-") // Replace multiple hyphens with single
                .replaceAll("^-|-$", ""); // Remove leading/trailing hyphens
        
        return normalized.isEmpty() ? "product" : normalized;
    }
    
    /**
     * Check if an image URL is a valid S3 URL
     */
    public static boolean isValidS3Url(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return false;
        }
        return imageUrl.startsWith(S3_BASE_URL) || imageUrl.startsWith("https://" + S3_BUCKET_NAME);
    }
    
    /**
     * Ensure imageUrl is set. If null/empty, generate based on category and productId
     * 
     * @param imageUrl Current imageUrl (may be null)
     * @param category Product category
     * @param productId Product ID
     * @return Valid imageUrl (either existing or generated)
     */
    public static String ensureImageUrl(String imageUrl, String category, Long productId) {
        // If imageUrl exists and is valid, use it
        if (imageUrl != null && !imageUrl.trim().isEmpty() && isValidS3Url(imageUrl)) {
            return imageUrl;
        }
        
        // Otherwise, generate based on category
        return generateImageUrl(category, productId);
    }
}

