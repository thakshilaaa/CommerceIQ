package com.commerceiq.repository;

import com.commerceiq.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    List<Notification> findByTargetRoleOrderByCreatedAtDesc(String role);
    List<Notification> findTop10ByOrderByCreatedAtDesc();
    long countByReadFalse();
}
