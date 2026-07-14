package com.commerceiq.service;

import com.commerceiq.exception.ResourceNotFoundException;
import com.commerceiq.model.Category;
import com.commerceiq.model.Product;
import com.commerceiq.model.Supplier;
import com.commerceiq.repository.CategoryRepository;
import com.commerceiq.repository.ProductRepository;
import com.commerceiq.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public Product createProduct(Product product, Long categoryId, Long supplierId) {
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
            product.setCategory(category);
        }
        if (supplierId != null) {
            Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", supplierId));
            product.setSupplier(supplier);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated, Long categoryId, Long supplierId) {
        Product product = getProductById(id);
        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setSku(updated.getSku());
        product.setPrice(updated.getPrice());
        product.setCostPrice(updated.getCostPrice());
        product.setStockQuantity(updated.getStockQuantity());
        product.setReorderLevel(updated.getReorderLevel());
        product.setImageUrl(updated.getImageUrl());
        product.setStatus(updated.getStatus());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
            product.setCategory(category);
        }
        if (supplierId != null) {
            Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", supplierId));
            product.setSupplier(supplier);
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product updateStock(Long id, Integer quantity) {
        Product product = getProductById(id);
        product.setStockQuantity(product.getStockQuantity() + quantity);
        return productRepository.save(product);
    }
}
