package com.equiplink.notification;

import com.equiplink.entity.Booking;
import com.equiplink.entity.User;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@equiplink.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(User user, String verificationLink) {
        String subject = "Verify Your Email Address - EquipLink";
        String htmlContent = buildHtmlTemplate(
            "Verify Your Email Address",
            "<p>Dear " + user.getFirstName() + ",</p>" +
            "<p>Thank you for registering on EquipLink. Please click the button below to verify your email address and activate your account:</p>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "  <a href='" + verificationLink + "' style='background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Verify Email</a>" +
            "</div>" +
            "<p>If the button doesn't work, you can copy and paste the following link into your browser:</p>" +
            "<p style='word-break: break-all; color: #64748b;'><a href='" + verificationLink + "'>" + verificationLink + "</a></p>" +
            "<p>This link will expire in 24 hours.</p>"
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to EquipLink - Your Heavy Machinery Marketplace";
        String htmlContent = buildHtmlTemplate(
            "Welcome to EquipLink!",
            "<p>Dear " + user.getFirstName() + ",</p>" +
            "<p>We are thrilled to welcome you to the EquipLink platform! Your account has been successfully set up as a <strong>" + user.getRole().name() + "</strong>.</p>" +
            "<p>Here is what you can do next:</p>" +
            "<ul>" +
            "  <li>" + (user.getRole().name().equals("OWNER") ? "List your heavy equipment and machinery to start generating revenue." : "Browse and request heavy equipment from verified owners across India.") + "</li>" +
            "  <li>Manage your profile and settings.</li>" +
            "  <li>Access your dynamic dashboard for real-time tracking.</li>" +
            "</ul>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "  <a href='" + frontendUrl + "/dashboard' style='background-color: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Go to Dashboard</a>" +
            "</div>"
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendForgotPasswordEmail(User user, String resetLink) {
        String subject = "Reset Your Password - EquipLink";
        String htmlContent = buildHtmlTemplate(
            "Reset Your Password",
            "<p>Dear " + user.getFirstName() + ",</p>" +
            "<p>You requested to reset your password. Please click the button below to set a new password:</p>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "  <a href='" + resetLink + "' style='background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Reset Password</a>" +
            "</div>" +
            "<p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>" +
            "<p style='word-break: break-all; color: #64748b;'><a href='" + resetLink + "'>" + resetLink + "</a></p>"
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendBookingRequestNotification(Booking booking) {
        User owner = booking.getEquipment().getOwner();
        User customer = booking.getCustomer();
        String subject = "New Booking Request: " + booking.getEquipment().getName();
        
        String htmlContent = buildHtmlTemplate(
            "New Rental Request Received",
            "<p>Dear " + owner.getFirstName() + ",</p>" +
            "<p>You have received a new booking request for your machinery <strong>" + booking.getEquipment().getName() + "</strong>.</p>" +
            "<div style='background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;'>" +
            "  <h3 style='margin-top: 0; color: #1e293b;'>Request Details</h3>" +
            "  <table style='width: 100%; font-size: 14px; border-collapse: collapse;'>" +
            "    <tr><td style='padding: 6px 0; color: #64748b;'>Customer Name:</td><td style='padding: 6px 0; font-weight: bold;'>" + customer.getFirstName() + " " + customer.getLastName() + "</td></tr>" +
            "    <tr><td style='padding: 6px 0; color: #64748b;'>Start Date:</td><td style='padding: 6px 0; font-weight: bold;'>" + booking.getStartDate() + "</td></tr>" +
            "    <tr><td style='padding: 6px 0; color: #64748b;'>End Date:</td><td style='padding: 6px 0; font-weight: bold;'>" + booking.getEndDate() + "</td></tr>" +
            "    <tr><td style='padding: 6px 0; color: #64748b;'>Daily Rate:</td><td style='padding: 6px 0; font-weight: bold; color: #f97316;'>₹" + booking.getEquipment().getDailyRentalPrice() + "</td></tr>" +
            "    <tr><td style='padding: 6px 0; color: #64748b;'>Message:</td><td style='padding: 6px 0; font-style: italic;'>" + (booking.getMessage() != null ? booking.getMessage() : "None") + "</td></tr>" +
            "  </table>" +
            "</div>" +
            "<p>Please review this request on your dashboard to approve or reject it:</p>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "  <a href='" + frontendUrl + "/dashboard/owner/bookings' style='background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Review Request</a>" +
            "</div>"
        );
        sendHtmlEmail(owner.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendBookingStatusNotification(Booking booking) {
        User customer = booking.getCustomer();
        String subject = "Booking Status Update: " + booking.getEquipment().getName();
        String statusText = booking.getStatus().name();
        String statusColor = "#f97316"; // pending / orange

        if (statusText.equals("APPROVED")) statusColor = "#22c55e"; // green
        else if (statusText.equals("REJECTED") || statusText.equals("CANCELLED")) statusColor = "#ef4444"; // red

        String statusMessageHtml = "";
        if (statusText.equals("APPROVED")) {
            statusMessageHtml = "<p style='color: #22c55e; font-weight: bold; font-size: 18px;'>Congratulations! Your rental request was approved.</p>" +
                                "<p>The owner has verified your details. Please check your dashboard for next steps and delivery arrangements.</p>";
        } else if (statusText.equals("REJECTED")) {
            statusMessageHtml = "<p style='color: #ef4444; font-weight: bold; font-size: 18px;'>Your rental request has been rejected.</p>" +
                                "<p>Unfortunately, the owner was unable to accommodate your request at this time. You can search the marketplace for similar equipment listings.</p>";
        } else if (statusText.equals("CANCELLED")) {
            statusMessageHtml = "<p style='color: #ef4444; font-weight: bold; font-size: 18px;'>Your booking was cancelled.</p>";
        } else {
            statusMessageHtml = "<p>The status of your rental request is now: <strong>" + statusText + "</strong>.</p>";
        }

        String htmlContent = buildHtmlTemplate(
            "Booking Status Update",
            "<p>Dear " + customer.getFirstName() + ",</p>" +
            "<p>We want to inform you that your booking status for <strong>" + booking.getEquipment().getName() + "</strong> has changed.</p>" +
            "<div style='border-left: 4px solid " + statusColor + "; background-color: #f8fafc; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;'>" +
            "  <span style='font-size: 12px; text-transform: uppercase; font-weight: bold; color: #64748b;'>New Status</span><br/>" +
            "  <strong style='font-size: 20px; color: " + statusColor + ";'>" + statusText + "</strong>" +
            "</div>" +
            statusMessageHtml +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "  <a href='" + frontendUrl + "/dashboard/customer/bookings' style='background-color: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>View Bookings</a>" +
            "</div>"
        );
        sendHtmlEmail(customer.getEmail(), subject, htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        log.info("Preparing to send email to: {} | Subject: {}", to, subject);

        if (mailSender == null) {
            log.warn("JavaMailSender bean is not configured on SMTP. Logging email content instead:");
            log.info("\n=== [MOCK SMTP EMAIL SENT] ===\nTo: {}\nSubject: {}\nContent:\n{}\n===============================", to, subject, htmlContent);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email successfully sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send SMTP email to {}. Falling back to console log. Error: {}", to, e.getMessage());
            log.info("\n=== [SMTP ERROR FALLBACK EMAIL] ===\nTo: {}\nSubject: {}\nContent:\n{}\n===============================", to, subject, htmlContent);
        }
    }

    private String buildHtmlTemplate(String title, String bodyContent) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "  <meta charset='utf-8'>" +
               "  <title>" + title + "</title>" +
               "  <style>" +
               "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
               "    .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding-bottom: 40px; pt-20px; }" +
               "    .main-table { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }" +
               "    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 30px; text-align: center; }" +
               "    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff; }" +
               "    .header span { color: #f97316; font-weight: bold; }" +
               "    .content { padding: 40px 30px; line-height: 1.6; font-size: 16px; color: #334155; }" +
               "    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-t: 1px solid #f1f5f9; }" +
               "    .footer a { color: #f97316; text-decoration: none; }" +
               "  </style>" +
               "</head>" +
               "<body>" +
               "  <div class='wrapper'>" +
               "    <table class='main-table' align='center' cellpadding='0' cellspacing='0' width='100%'>" +
               "      <tr>" +
               "        <td class='header'>" +
               "          <h1>Equip<span>Link</span></h1>" +
               "          <div style='font-size: 12px; margin-top: 5px; color: #94a3b8; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;'>Heavy Machinery Marketplace</div>" +
               "        </td>" +
               "      </tr>" +
               "      <tr>" +
               "        <td class='content'>" +
               "          <h2 style='margin-top: 0; color: #0f172a; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;'>" + title + "</h2>" +
               "          " + bodyContent + "" +
               "        </td>" +
               "      </tr>" +
               "      <tr>" +
               "        <td class='footer'>" +
               "          <p>&copy; 2026 EquipLink Technologies Private Limited. All rights reserved.</p>" +
               "          <p>Direct Heavy Fleet Machinery Rental without middlemen.</p>" +
               "          <p><a href='" + frontendUrl + "'>Visit Website</a> | <a href='mailto:support@equiplink.com'>Contact Support</a></p>" +
               "        </td>" +
               "      </tr>" +
               "    </table>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }
}
