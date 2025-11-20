package com.example.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();

        Long totalUsers = 0L;
        try {
            totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
        } catch (Exception e) {
            // Table might not exist or connection issue
        }

        Long activeUsers = 0L;
        try {
            activeUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE UPPER(status) = 'ACTIVE'", Long.class);
        } catch (Exception e) {
            // Status column might not exist or different format
        }

        Long totalListings = 0L;
        try {
            totalListings = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Long.class);
        } catch (Exception e) {
            // Products table might not exist
        }

        Long openReports = 0L;
        try {
            // Reports status is a boolean: NULL or false = open, true = resolved/closed
            openReports = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM reports WHERE status IS NULL OR status = false", Long.class);
        } catch (Exception e) {
            // Reports table might not exist or different schema
        }

        stats.put("totalUsers", totalUsers != null ? totalUsers : 0L);
        stats.put("activeUsers", activeUsers != null ? activeUsers : 0L);
        stats.put("totalListings", totalListings != null ? totalListings : 0L);
        stats.put("openReports", openReports != null ? openReports : 0L);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT id, username, email, first_name, last_name, status FROM users ORDER BY id DESC");
        return ResponseEntity.ok(rows);
    }

    // Note: listings are stored in the 'products' table
    @GetMapping("/listings")
    public ResponseEntity<List<Map<String, Object>>> getListings() {
        List<Map<String, Object>> rows;
        try {
            // Try joining with categories and conditions tables (if using foreign keys)
            String query = "SELECT p.*, " +
                    "COALESCE(c.category, CAST(p.category_id AS VARCHAR), 'Unknown') as category, " +
                    "COALESCE(cond.condition_name, CAST(p.condition_id AS VARCHAR), 'Unknown') as cond " +
                    "FROM products p " +
                    "LEFT JOIN categories c ON p.category_id = c.id " +
                    "LEFT JOIN conditions cond ON p.condition_id = cond.id " +
                    "ORDER BY p.id DESC";
            rows = jdbcTemplate.queryForList(query);
        } catch (Exception e) {
            // Fallback: if join fails, use direct columns (category and cond are varchar)
            rows = jdbcTemplate.queryForList(
                    "SELECT * FROM products ORDER BY id DESC");
        }
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> getReports() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM reports ORDER BY id DESC");
        return ResponseEntity.ok(rows);
    }
}
