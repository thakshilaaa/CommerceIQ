package com.commerceiq.controller;

import com.commerceiq.dto.ApiResponse;
import com.commerceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    @GetMapping("/sales-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesSummary(
            @RequestParam(defaultValue = "30") int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("period", days + " days");
        summary.put("totalOrders", orderRepository.countOrdersSince(since));
        BigDecimal rev = orderRepository.getRevenueSince(since);
        summary.put("totalRevenue", rev != null ? rev : BigDecimal.ZERO);
        summary.put("monthlySales", orderRepository.getMonthlySalesData(since));
        summary.put("orderStatusBreakdown", orderRepository.getOrderStatusCounts());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/inventory-report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalProducts", productRepository.count());
        report.put("lowStockProducts", productRepository.findLowStockProducts());
        report.put("outOfStock", productRepository.findByStockQuantityLessThanEqual(0).size());
        report.put("allProducts", productRepository.findAllOrderByStock());
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/customer-report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerReport() {
        LocalDateTime thisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalCustomers", customerRepository.count());
        report.put("newThisMonth", customerRepository.countNewCustomersSince(thisMonth));
        report.put("allCustomers", customerRepository.findAll());
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/product-performance")
    public ResponseEntity<ApiResponse<List<Object[]>>> getProductPerformance() {
        return ResponseEntity.ok(ApiResponse.success(orderItemRepository.getTopSellingProducts()));
    }

    @GetMapping("/payment-report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        BigDecimal total = paymentRepository.getTotalCompletedPayments();
        report.put("totalCompleted", total != null ? total : BigDecimal.ZERO);
        report.put("methodBreakdown", paymentRepository.getPaymentMethodStats());
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
