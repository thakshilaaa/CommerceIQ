package com.commerceiq.service;

import com.commerceiq.dto.OrderRequestDTO;
import com.commerceiq.exception.ResourceNotFoundException;
import com.commerceiq.model.*;
import com.commerceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private PaymentRepository paymentRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    @Transactional
    public Order createOrder(OrderRequestDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", request.getCustomerId()));

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : customer.getAddress());
        order.setNotes(request.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);

        // Build order items
        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequestDTO.OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemDTO.getProductId()));

            if (product.getStockQuantity() < itemDTO.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
            items.add(item);

            subtotal = subtotal.add(item.getTotalPrice());

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - itemDTO.getQuantity());
            productRepository.save(product);
        }

        BigDecimal discount = request.getDiscount() != null ? BigDecimal.valueOf(request.getDiscount()) : BigDecimal.ZERO;
        BigDecimal taxRate = request.getTaxRate() != null ? BigDecimal.valueOf(request.getTaxRate()) : BigDecimal.valueOf(0.1);
        BigDecimal taxAmount = subtotal.subtract(discount).multiply(taxRate);
        BigDecimal total = subtotal.subtract(discount).add(taxAmount);

        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(total);
        order.setOrderItems(items);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(items);

        // Create payment record
        if (request.getPaymentMethod() != null) {
            Payment payment = new Payment();
            payment.setOrder(savedOrder);
            payment.setAmount(total);
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
            paymentRepository.save(payment);
        }

        return savedOrder;
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByStatus(String status) {
        try {
            return orderRepository.findByStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
