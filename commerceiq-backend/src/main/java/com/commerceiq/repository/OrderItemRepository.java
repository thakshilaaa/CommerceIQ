package com.commerceiq.repository;

import com.commerceiq.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity) as totalSold, SUM(oi.totalPrice) as totalRevenue " +
           "FROM OrderItem oi GROUP BY oi.product.id, oi.product.name ORDER BY totalSold DESC")
    List<Object[]> getTopSellingProducts();
}
