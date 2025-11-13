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

        Long totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
        Long activeUsers;
        try {
            activeUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE UPPER(status) = 'ACTIVE'", Long.class);
        } catch (Exception e) {
            activeUsers = 0L;
        }

        Long totalListings;
        try {
            totalListings = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Long.class);
        } catch (Exception e) {
            totalListings = 0L;
        }

        Long openReports;
        try {
            openReports = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM reports WHERE UPPER(status) = 'OPEN'", Long.class);
        } catch (Exception e) {
            openReports = 0L;
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
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM products ORDER BY id DESC");
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> getReports() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM reports ORDER BY id DESC");
        return ResponseEntity.ok(rows);
    }
}
