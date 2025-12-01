package com.example.app.repository;

import com.example.app.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByProductId(Long productId);
    
    List<Report> findByCreateAuditId(Long userId);
    
    List<Report> findByStatus(Boolean status);
    
    boolean existsByProductIdAndCreateAuditId(Long productId, Long userId);
}

