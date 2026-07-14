package com.commerceiq.repository;

import com.commerceiq.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByStatus(Order.OrderStatus status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED' AND o.status != 'RETURNED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'CANCELLED'")
    BigDecimal getRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    Long countOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT FUNCTION('MONTH', o.createdAt) as month, SUM(o.totalAmount) as revenue " +
           "FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'CANCELLED' " +
           "GROUP BY FUNCTION('MONTH', o.createdAt) ORDER BY month")
    List<Object[]> getMonthlySalesData(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrderStatusCounts();
}
