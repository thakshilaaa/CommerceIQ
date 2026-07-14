package com.commerceiq.service;

import com.commerceiq.exception.ResourceNotFoundException;
import com.commerceiq.model.Payment;
import com.commerceiq.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
    }

    public Payment updatePaymentStatus(Long id, String status) {
        Payment payment = getPaymentById(id);
        try {
            payment.setStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment status: " + status);
        }
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByStatus(String status) {
        try {
            return paymentRepository.findByStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
