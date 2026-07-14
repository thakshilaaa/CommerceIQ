package com.commerceiq.controller;

import com.commerceiq.dto.ApiResponse;
import com.commerceiq.model.Notification;
import com.commerceiq.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getAllNotifications()));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnread() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadNotifications()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", notificationService.getUnreadCount())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markAsRead(id)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success("All marked as read", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> create(@RequestBody Map<String, String> body) {
        Notification notif = notificationService.createNotification(
                body.get("title"), body.get("message"),
                body.getOrDefault("type", "INFO"),
                body.get("targetRole")
        );
        return ResponseEntity.ok(ApiResponse.success(notif));
    }
}
