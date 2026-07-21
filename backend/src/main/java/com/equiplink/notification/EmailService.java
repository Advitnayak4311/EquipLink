package com.equiplink.notification;

import com.equiplink.entity.Booking;
import com.equiplink.entity.User;

/**
 * Service interface for sending transactional emails (SMTP) in EquipLink.
 */
public interface EmailService {

    void sendVerificationEmail(User user, String verificationLink);

    void sendWelcomeEmail(User user);

    void sendForgotPasswordEmail(User user, String resetLink);

    void sendBookingRequestNotification(Booking booking);

    void sendBookingStatusNotification(Booking booking);
}
