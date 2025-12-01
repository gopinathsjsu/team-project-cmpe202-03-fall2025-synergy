package com.example.app.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {
    
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
    
    @Value("${aws.s3.bucket-name:spartan-exchange-s3}")
    private String bucketName;
    
    @Value("${aws.s3.region:us-east-1}")
    private String region;
    
    @Value("${aws.access-key-id:}")
    private String accessKeyId;
    
    @Value("${aws.secret-access-key:}")
    private String secretAccessKey;
    
    private S3Client s3Client;
    
    @PostConstruct
    public void initS3Client() {
        // Initialize S3 client with credentials from configuration or environment
        software.amazon.awssdk.regions.Region awsRegion = software.amazon.awssdk.regions.Region.of(region);
        
        // Use explicit credentials if provided, otherwise use default credential chain
        if (accessKeyId != null && !accessKeyId.trim().isEmpty() 
            && secretAccessKey != null && !secretAccessKey.trim().isEmpty()) {
            logger.info("Using explicit AWS credentials from configuration");
            AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            this.s3Client = S3Client.builder()
                    .region(awsRegion)
                    .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                    .build();
        } else {
            logger.info("Using default AWS credential chain (environment variables or AWS config)");
            this.s3Client = S3Client.builder()
                    .region(awsRegion)
                    .build();
        }
        
        logger.info("S3 Client initialized for bucket: {}, region: {}", bucketName, region);
    }
    
    /**
     * Upload an image file to S3 bucket
     * 
     * @param file The image file to upload
     * @param category The product category (used for folder organization)
     * @return The public URL of the uploaded image
     * @throws IOException if file upload fails
     */
    public String uploadImage(MultipartFile file, String category) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            // Default to jpg if no extension
            fileExtension = ".jpg";
        }
        
        // Generate unique filename: UUID + extension
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        // Organize by category: category/filename.jpg
        String categoryFolder = (category != null && !category.trim().isEmpty()) 
            ? category.toLowerCase().trim() 
            : "default";
        String s3Key = categoryFolder + "/" + fileName;
        
        logger.info("Uploading image to S3: bucket={}, key={}", bucketName, s3Key);
        
        try {
            // Upload file to S3 with public read ACL
            // Note: If bucket has ACLs disabled, this will fail but we'll continue
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(contentType)
                    .acl(ObjectCannedACL.PUBLIC_READ)  // Set ACL in the upload request
                    .build();
            
            s3Client.putObject(putObjectRequest, 
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            // Generate public URL with region
            String imageUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Key);
            
            logger.info("Image uploaded successfully: {}", imageUrl);
            
            return imageUrl;
            
        } catch (software.amazon.awssdk.services.s3.model.S3Exception e) {
            // If ACLs are disabled, try uploading without ACL
            if (e.statusCode() == 400 && e.getMessage().contains("ACL")) {
                logger.warn("Bucket ACLs are disabled, uploading without ACL. Bucket policy should make objects public.");
                try {
                    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(s3Key)
                            .contentType(contentType)
                            .build();
                    
                    s3Client.putObject(putObjectRequest, 
                            RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                    
                    String imageUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Key);
                    logger.info("Image uploaded successfully (without ACL): {}", imageUrl);
                    return imageUrl;
                } catch (Exception retryException) {
                    logger.error("Error uploading image to S3 (retry without ACL)", retryException);
                    throw new IOException("Failed to upload image to S3: " + retryException.getMessage(), retryException);
                }
            } else {
                logger.error("Error uploading image to S3", e);
                throw new IOException("Failed to upload image to S3: " + e.getMessage(), e);
            }
        } catch (Exception e) {
            logger.error("Error uploading image to S3", e);
            throw new IOException("Failed to upload image to S3: " + e.getMessage(), e);
        }
    }
    
    /**
     * Delete an image from S3 bucket
     * 
     * @param imageUrl The S3 URL of the image to delete
     */
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        
        try {
            // Extract key from URL
            // Format: https://bucket-name.s3.amazonaws.com/key
            String key = imageUrl.substring(imageUrl.indexOf(".com/") + 5);
            
            logger.info("Deleting image from S3: bucket={}, key={}", bucketName, key);
            
            s3Client.deleteObject(builder -> builder
                    .bucket(bucketName)
                    .key(key)
                    .build());
            
            logger.info("Image deleted successfully: {}", key);
            
        } catch (Exception e) {
            logger.error("Error deleting image from S3: {}", imageUrl, e);
            // Don't throw - deletion failure shouldn't break the flow
        }
    }
}

