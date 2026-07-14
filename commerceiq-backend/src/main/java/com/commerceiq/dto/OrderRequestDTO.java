package com.commerceiq.dto;

import com.commerceiq.model.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {

    @NotNull
    private Long customerId;

    private String shippingAddress;

    private String notes;

    private Double discount;

    private Double taxRate;

    private Payment.PaymentMethod paymentMethod;

    @NotNull
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
    }
}
