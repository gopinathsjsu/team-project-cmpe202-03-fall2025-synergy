package com.synergy.backend.listing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByCategoryIgnoreCase(String category);
    List<Listing> findByPriceBetween(BigDecimal min, BigDecimal max);
}


