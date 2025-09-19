package com.synergy.backend.listing;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = {"http://localhost:5173"})
public class ListingController {

    private final ListingRepository repository;

    public ListingController(ListingRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Listing> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        if (category != null && !category.isBlank()) {
            return repository.findByCategoryIgnoreCase(category);
        }
        if (minPrice != null && maxPrice != null) {
            return repository.findByPriceBetween(minPrice, maxPrice);
        }
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getOne(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Listing> create(@Valid @RequestBody Listing listing) {
        Listing saved = repository.save(listing);
        return ResponseEntity.created(URI.create("/api/listings/" + saved.getId())).body(saved);
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Listing> markSold(@PathVariable Long id) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setSold(true);
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


