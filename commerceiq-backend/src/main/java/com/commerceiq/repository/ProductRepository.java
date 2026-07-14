package com.commerceiq.repository;

import com.commerceiq.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySupplierId(Long supplierId);
    List<Product> findByStatus(String status);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByStockQuantityLessThanEqual(Integer quantity);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.reorderLevel")
    List<Product> findLowStockProducts();

    @Query("SELECT p FROM Product p ORDER BY p.stockQuantity ASC")
    List<Product> findAllOrderByStock();
}
