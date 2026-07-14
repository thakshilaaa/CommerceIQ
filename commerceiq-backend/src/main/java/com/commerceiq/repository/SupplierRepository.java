package com.commerceiq.repository;

import com.commerceiq.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByStatus(String status);
    List<Supplier> findByNameContainingIgnoreCase(String name);
}
