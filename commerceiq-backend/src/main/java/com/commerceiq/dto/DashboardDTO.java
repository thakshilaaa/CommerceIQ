package com.commerceiq.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardDTO {
    // KPIs
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private Long totalOrders;
    private Long ordersThisMonth;
    private Long totalCustomers;
    private Long newCustomersThisMonth;
    private Long totalProducts;
    private Long lowStockProducts;

    // Revenue growth
    private Double revenueGrowthPercent;
    private Double orderGrowthPercent;
    private Double customerGrowthPercent;

    // Charts
    private List<MonthlySalesDTO> monthlySales;
    private List<TopProductDTO> topProducts;
    private List<OrderStatusDTO> orderStatusDistribution;
    private List<PaymentMethodDTO> paymentMethodDistribution;
    private List<RecentOrderDTO> recentOrders;

    @Data
    public static class MonthlySalesDTO {
        private String month;
        private BigDecimal revenue;
        private Long orders;
    }

    @Data
    public static class TopProductDTO {
        private Long productId;
        private String productName;
        private Long totalSold;
        private BigDecimal totalRevenue;
    }

    @Data
    public static class OrderStatusDTO {
        private String status;
        private Long count;
    }

    @Data
    public static class PaymentMethodDTO {
        private String method;
        private Long count;
        private BigDecimal amount;
    }

    @Data
    public static class RecentOrderDTO {
        private Long id;
        private String orderNumber;
        private String customerName;
        private BigDecimal total;
        private String status;
        private String date;
    }
}
