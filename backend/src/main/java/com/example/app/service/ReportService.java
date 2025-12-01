package com.example.app.service;

import com.example.app.dto.ReportRequest;
import com.example.app.dto.ReportResponse;
import com.example.app.model.Product;
import com.example.app.model.Report;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Create a new report for a product
     * @param request Report request containing productId and reason
     * @param userId ID of the user creating the report
     * @return ReportResponse
     * @throws RuntimeException if product not found or user already reported this product
     */
    @Transactional
    public ReportResponse createReport(ReportRequest request, Long userId) {
        // Verify product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));
        
        // Check if user already reported this product
        if (reportRepository.existsByProductIdAndCreateAuditId(request.getProductId(), userId)) {
            throw new RuntimeException("You have already reported this listing");
        }
        
        // Prevent users from reporting their own listings
        if (product.getSellerId() != null && product.getSellerId().equals(userId)) {
            throw new RuntimeException("You cannot report your own listing");
        }
        
        // Create and save report
        // Note: listing_id is the same as product_id since listings are stored in the products table
        Report report = new Report(request.getProductId(), request.getProductId(), request.getReason(), userId);
        Report savedReport = reportRepository.save(report);
        
        // Convert to response DTO
        return new ReportResponse(
                savedReport.getId(),
                savedReport.getProductId(),
                savedReport.getReason(),
                savedReport.getStatus(),
                savedReport.getCreateAuditId(),
                savedReport.getCreateAuditTime()
        );
    }
    
    /**
     * Get all reports for a specific product
     */
    public java.util.List<Report> getReportsByProductId(Long productId) {
        return reportRepository.findByProductId(productId);
    }
    
    /**
     * Get all reports created by a specific user
     */
    public java.util.List<Report> getReportsByUserId(Long userId) {
        return reportRepository.findByCreateAuditId(userId);
    }
}

