package com.commerceiq.service;

import com.commerceiq.model.Notification;
import com.commerceiq.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    public Notification createNotification(String title, String message, String type, String targetRole) {
        Notification notif = new Notification();
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setType(type);
        notif.setTargetRole(targetRole);
        return notificationRepository.save(notif);
    }

    public Notification markAsRead(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
