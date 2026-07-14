package com.commerceiq.controller;

import com.commerceiq.dto.ApiResponse;
import com.commerceiq.model.Product;
import com.commerceiq.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        List<Product> products;
        if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search);
        } else if (categoryId != null) {
            products = productService.getProductsByCategory(categoryId);
        } else {
            products = productService.getAllProducts();
        }
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<Product>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.success(productService.getLowStockProducts()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Product>> create(
            @RequestBody Product product,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId) {
        return ResponseEntity.ok(ApiResponse.success("Product created",
                productService.createProduct(product, categoryId, supplierId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Product>> update(
            @PathVariable Long id,
            @RequestBody Product product,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId) {
        return ResponseEntity.ok(ApiResponse.success("Product updated",
                productService.updateProduct(id, product, categoryId, supplierId)));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    public ResponseEntity<ApiResponse<Product>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        if (quantity == null) throw new IllegalArgumentException("quantity is required");
        return ResponseEntity.ok(ApiResponse.success("Stock updated", productService.updateStock(id, quantity)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }
}
