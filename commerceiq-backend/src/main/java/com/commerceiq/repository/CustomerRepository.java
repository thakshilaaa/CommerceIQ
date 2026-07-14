package com.commerceiq.repository;

import com.commerceiq.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByStatus(String status);
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last);
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt >= :startDate")
    Long countNewCustomersSince(LocalDateTime startDate);
}
