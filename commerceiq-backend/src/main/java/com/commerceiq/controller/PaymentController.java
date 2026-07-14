package com.commerceiq.controller;

import com.commerceiq.dto.ApiResponse;
import com.commerceiq.model.Payment;
import com.commerceiq.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Payment>>> getAll(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentsByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Payment>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) throw new IllegalArgumentException("status is required");
        return ResponseEntity.ok(ApiResponse.success("Payment status updated",
                paymentService.updatePaymentStatus(id, status)));
    }
}
