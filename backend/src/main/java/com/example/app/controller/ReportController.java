package com.example.app.controller;

import com.example.app.dto.ReportRequest;
import com.example.app.dto.ReportResponse;
import com.example.app.service.ReportService;
import com.example.app.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Create a new report for a listing
     * POST /api/reports
     * Requires authentication - user ID is extracted from JWT token
     */
    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Valid @RequestBody ReportRequest request) {
        try {
            // Extract user ID from JWT token
            Long userId = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    userId = jwtUtil.extractUserId(token);
                }
            }
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required. Please log in to report a listing."));
            }
            
            // Create report
            ReportResponse response = reportService.createReport(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create report: " + e.getMessage()));
        }
    }
}

