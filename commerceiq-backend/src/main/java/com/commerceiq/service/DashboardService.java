package com.commerceiq.service;

import com.commerceiq.dto.DashboardDTO;
import com.commerceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private PaymentRepository paymentRepository;

    public DashboardDTO getDashboardData() {
        DashboardDTO dto = new DashboardDTO();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime startOfYear = now.withMonth(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        // Total revenue
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        dto.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // Revenue this month
        BigDecimal revenueThisMonth = orderRepository.getRevenueSince(startOfMonth);
        dto.setRevenueThisMonth(revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO);

        // Revenue last month
        BigDecimal revenueLastMonth = orderRepository.getRevenueSince(startOfLastMonth);
        if (revenueLastMonth != null && revenueLastMonth.compareTo(BigDecimal.ZERO) > 0 && revenueThisMonth != null) {
            BigDecimal growth = revenueThisMonth.subtract(revenueLastMonth)
                    .divide(revenueLastMonth, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            dto.setRevenueGrowthPercent(growth.doubleValue());
        } else {
            dto.setRevenueGrowthPercent(0.0);
        }

        // Orders
        dto.setTotalOrders(orderRepository.count());
        Long ordersThisMonth = orderRepository.countOrdersSince(startOfMonth);
        dto.setOrdersThisMonth(ordersThisMonth != null ? ordersThisMonth : 0L);

        Long ordersLastMonth = orderRepository.countOrdersSince(startOfLastMonth);
        if (ordersLastMonth != null && ordersLastMonth > 0 && ordersThisMonth != null) {
            dto.setOrderGrowthPercent(((double)(ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100);
        } else {
            dto.setOrderGrowthPercent(0.0);
        }

        // Customers
        dto.setTotalCustomers(customerRepository.count());
        Long newCustomers = customerRepository.countNewCustomersSince(startOfMonth);
        dto.setNewCustomersThisMonth(newCustomers != null ? newCustomers : 0L);
        dto.setCustomerGrowthPercent(5.2); // placeholder

        // Products
        dto.setTotalProducts(productRepository.count());
        dto.setLowStockProducts((long) productRepository.findLowStockProducts().size());

        // Monthly sales (last 6 months)
        List<DashboardDTO.MonthlySalesDTO> monthlySales = new ArrayList<>();
        List<Object[]> rawSales = orderRepository.getMonthlySalesData(startOfYear);
        for (Object[] row : rawSales) {
            DashboardDTO.MonthlySalesDTO ms = new DashboardDTO.MonthlySalesDTO();
            int monthNum = ((Number) row[0]).intValue();
            ms.setMonth(Month.of(monthNum).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            ms.setRevenue(row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO);
            ms.setOrders(0L);
            monthlySales.add(ms);
        }
        dto.setMonthlySales(monthlySales);

        // Top products
        List<DashboardDTO.TopProductDTO> topProducts = new ArrayList<>();
        List<Object[]> rawProducts = orderItemRepository.getTopSellingProducts();
        for (int i = 0; i < Math.min(5, rawProducts.size()); i++) {
            Object[] row = rawProducts.get(i);
            DashboardDTO.TopProductDTO tp = new DashboardDTO.TopProductDTO();
            tp.setProductId(((Number) row[0]).longValue());
            tp.setProductName((String) row[1]);
            tp.setTotalSold(((Number) row[2]).longValue());
            tp.setTotalRevenue(new BigDecimal(row[3].toString()));
            topProducts.add(tp);
        }
        dto.setTopProducts(topProducts);

        // Order status distribution
        List<DashboardDTO.OrderStatusDTO> statusDist = new ArrayList<>();
        List<Object[]> rawStatus = orderRepository.getOrderStatusCounts();
        for (Object[] row : rawStatus) {
            DashboardDTO.OrderStatusDTO os = new DashboardDTO.OrderStatusDTO();
            os.setStatus(row[0].toString());
            os.setCount(((Number) row[1]).longValue());
            statusDist.add(os);
        }
        dto.setOrderStatusDistribution(statusDist);

        // Payment method distribution
        List<DashboardDTO.PaymentMethodDTO> paymentDist = new ArrayList<>();
        List<Object[]> rawPayments = paymentRepository.getPaymentMethodStats();
        for (Object[] row : rawPayments) {
            DashboardDTO.PaymentMethodDTO pm = new DashboardDTO.PaymentMethodDTO();
            pm.setMethod(row[0].toString());
            pm.setCount(((Number) row[1]).longValue());
            pm.setAmount(new BigDecimal(row[2].toString()));
            paymentDist.add(pm);
        }
        dto.setPaymentMethodDistribution(paymentDist);

        // Recent orders
        List<DashboardDTO.RecentOrderDTO> recentOrders = new ArrayList<>();
        orderRepository.findRecentOrders(startOfMonth).stream().limit(10).forEach(o -> {
            DashboardDTO.RecentOrderDTO ro = new DashboardDTO.RecentOrderDTO();
            ro.setId(o.getId());
            ro.setOrderNumber(o.getOrderNumber());
            ro.setCustomerName(o.getCustomer().getFirstName() + " " + o.getCustomer().getLastName());
            ro.setTotal(o.getTotalAmount());
            ro.setStatus(o.getStatus().name());
            ro.setDate(o.getCreatedAt() != null ? o.getCreatedAt().toString() : "");
            recentOrders.add(ro);
        });
        dto.setRecentOrders(recentOrders);

        return dto;
    }
}
