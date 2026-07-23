package com.equiplink.entity;

import com.equiplink.entity.enums.BookingStatus;
import com.equiplink.entity.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents rental bookings and rental transitions.
 */
@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", referencedColumnName = "id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private User customer;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(columnDefinition = "TEXT")
    private String message;

    // ---- Enhanced Site Delivery & 3-Way Location Tracking Fields ----

    @Column(name = "site_address", columnDefinition = "TEXT")
    private String siteAddress;

    @Column(name = "work_purpose")
    private String workPurpose;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "gstin")
    private String gstin;

    @Column(name = "estimated_distance_km")
    private Double estimatedDistanceKm;

    @Column(name = "mobilization_cost")
    private Double mobilizationCost;

    // ---- Live Video & Document Verification Fields ----

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    @Column(name = "video_call_room_id")
    private String videoCallRoomId;

    @Column(name = "video_call_scheduled_at")
    private LocalDateTime videoCallScheduledAt;

    @Column(name = "video_verified_at")
    private LocalDateTime videoVerifiedAt;

    @Column(name = "rc_document_url", columnDefinition = "TEXT")
    private String rcDocumentUrl;

    @Column(name = "insurance_document_url", columnDefinition = "TEXT")
    private String insuranceDocumentUrl;

    @Column(name = "fitness_certificate_url", columnDefinition = "TEXT")
    private String fitnessCertificateUrl;

    @Column(name = "operator_license_url", columnDefinition = "TEXT")
    private String operatorLicenseUrl;

    @Column(name = "documents_verified_at")
    private LocalDateTime documentsVerifiedAt;
}
