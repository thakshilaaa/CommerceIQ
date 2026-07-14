package com.commerceiq.controller;

import com.commerceiq.dto.ApiResponse;
import com.commerceiq.dto.DashboardDTO;
import com.commerceiq.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardData()));
    }
}
