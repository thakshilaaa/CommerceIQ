package com.commerceiq.service;

import com.commerceiq.exception.ResourceNotFoundException;
import com.commerceiq.model.Supplier;
import com.commerceiq.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", id));
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updated) {
        Supplier supplier = getSupplierById(id);
        supplier.setName(updated.getName());
        supplier.setEmail(updated.getEmail());
        supplier.setPhone(updated.getPhone());
        supplier.setAddress(updated.getAddress());
        supplier.setContactPerson(updated.getContactPerson());
        supplier.setStatus(updated.getStatus());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }

    public List<Supplier> searchSuppliers(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }
}
