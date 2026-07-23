package com.equiplink.service.impl;

import com.equiplink.dto.request.BookingRequest;
import com.equiplink.dto.response.BookingResponse;
import com.equiplink.dto.response.BookingSummaryResponse;
import com.equiplink.entity.Booking;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.User;
import com.equiplink.entity.enums.BookingStatus;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.entity.enums.UserRole;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.mapper.BookingMapper;
import com.equiplink.repository.BookingRepository;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.service.BookingService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Service implementation for managing rental bookings workflows.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final com.equiplink.notification.EmailService emailService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new AccessDeniedException("Only customers can submit booking requests");
        }

        Equipment equipment = equipmentRepository.findById(request.equipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));

        // Validation: Cannot book own equipment
        if (equipment.getOwner().getEmail().equals(customerEmail)) {
            throw new IllegalArgumentException("You cannot submit rental requests for your own equipment listing");
        }

        // Validation: Must be available status
        if (equipment.getAvailabilityStatus() != EquipmentStatus.AVAILABLE) {
            throw new IllegalStateException("Machinery listing is currently unavailable for bookings");
        }

        // Validation: Date bounds
        LocalDate today = LocalDate.now();
        if (request.startDate().isBefore(today)) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }
        if (!request.endDate().isAfter(request.startDate())) {
            throw new IllegalArgumentException("End date must be after the start date");
        }
        if (ChronoUnit.DAYS.between(request.startDate(), request.endDate()) < 1) {
            throw new IllegalArgumentException("Booking duration must be at least 1 day");
        }

        // Validation: Date overlaps check
        if (bookingRepository.hasOverlappingApprovedBooking(request.equipmentId(), request.startDate(), request.endDate())) {
            throw new IllegalStateException("Machinery is already booked by another lessor during the requested dates");
        }

        Booking booking = Booking.builder()
                .equipment(equipment)
                .customer(customer)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(BookingStatus.PENDING)
                .message(request.message())
                .siteAddress(request.siteAddress() != null && !request.siteAddress().isBlank() ? request.siteAddress() : equipment.getLocation())
                .workPurpose(request.workPurpose() != null && !request.workPurpose().isBlank() ? request.workPurpose() : "Heavy Machinery Operations")
                .contactPhone(request.contactPhone() != null && !request.contactPhone().isBlank() ? request.contactPhone() : customer.getPhone())
                .companyName(request.companyName() != null && !request.companyName().isBlank() ? request.companyName() : customer.getCompanyName())
                .gstin(request.gstin() != null && !request.gstin().isBlank() ? request.gstin() : customer.getGstin())
                .build();

        booking.setVideoCallRoomId("equiplink-room-" + System.currentTimeMillis());
        booking.setVerificationStatus(com.equiplink.entity.enums.VerificationStatus.UNVERIFIED);
        booking.setEstimatedDistanceKm(42.5 + (equipment.getId() % 30));
        booking.setMobilizationCost(booking.getEstimatedDistanceKm() * 120.0);

        bookingRepository.save(booking);
        log.info("Rental request submitted successfully for equipment {} by customer {}", equipment.getId(), customerEmail);

        try {
            emailService.sendBookingRequestNotification(booking);
        } catch (Exception e) {
            log.error("Failed to send booking request notification email: {}", e.getMessage());
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingSummaryResponse> listMyBookings(String customerEmail, Pageable pageable) {
        Specification<Booking> spec = (root, query, cb) ->
                cb.equal(root.get("customer").get("email"), customerEmail);

        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        return page.map(bookingMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingSummaryResponse> listOwnerBookings(
            String ownerEmail, String search, BookingStatus status, Pageable pageable
    ) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("equipment").get("owner").get("email"), ownerEmail));

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("equipment").get("name")), searchPattern),
                        cb.like(cb.lower(root.get("customer").get("firstName")), searchPattern),
                        cb.like(cb.lower(root.get("customer").get("lastName")), searchPattern),
                        cb.like(cb.lower(root.get("siteAddress")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        return page.map(bookingMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingDetails(Long id, String currentUserEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        boolean isCustomer = booking.getCustomer().getEmail().equals(currentUserEmail);
        boolean isOwner = booking.getEquipment().getOwner().getEmail().equals(currentUserEmail);
        boolean isAdmin = userRepository.findByEmail(currentUserEmail)
                .map(u -> u.getRole() == UserRole.ADMIN).orElse(false);

        if (!isCustomer && !isOwner && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to view details for this booking");
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse approveBooking(Long id, String ownerEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        if (!booking.getEquipment().getOwner().getEmail().equals(ownerEmail)) {
            throw new AccessDeniedException("Only the equipment owner can approve this booking request");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending booking requests can be approved");
        }

        // Overlap safety double check
        if (bookingRepository.hasOverlappingApprovedBooking(
                booking.getEquipment().getId(), booking.getStartDate(), booking.getEndDate())) {
            throw new IllegalStateException("Conflicting approved booking already exists for the requested dates");
        }

        booking.setStatus(BookingStatus.APPROVED);
        bookingRepository.save(booking);
        log.info("Booking request {} approved by owner {}", id, ownerEmail);

        try {
            emailService.sendBookingStatusNotification(booking);
        } catch (Exception e) {
            log.error("Failed to send booking approval notification email: {}", e.getMessage());
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(Long id, String ownerEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        if (!booking.getEquipment().getOwner().getEmail().equals(ownerEmail)) {
            throw new AccessDeniedException("Only the equipment owner can reject this booking request");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending booking requests can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
        log.info("Booking request {} rejected by owner {}", id, ownerEmail);

        try {
            emailService.sendBookingStatusNotification(booking);
        } catch (Exception e) {
            log.error("Failed to send booking rejection notification email: {}", e.getMessage());
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, String customerEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        if (!booking.getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("Only the customer who requested the booking can cancel it");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending booking requests can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking request {} cancelled by customer {}", id, customerEmail);

        try {
            emailService.sendBookingStatusNotification(booking);
        } catch (Exception e) {
            log.error("Failed to send booking cancellation notification email: {}", e.getMessage());
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingSummaryResponse verifyVideoInspection(Long id, String currentUserEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        booking.setVideoVerifiedAt(java.time.LocalDateTime.now());
        if (booking.getVerificationStatus() == com.equiplink.entity.enums.VerificationStatus.DOCUMENTS_VERIFIED) {
            booking.setVerificationStatus(com.equiplink.entity.enums.VerificationStatus.FULLY_VERIFIED);
        } else {
            booking.setVerificationStatus(com.equiplink.entity.enums.VerificationStatus.VIDEO_VERIFIED);
        }

        bookingRepository.save(booking);
        log.info("Booking {} live video verified by {}", id, currentUserEmail);
        return bookingMapper.toSummaryResponse(booking);
    }

    @Override
    @Transactional
    public BookingSummaryResponse verifyDocuments(Long id, String currentUserEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found"));

        booking.setDocumentsVerifiedAt(java.time.LocalDateTime.now());
        if (booking.getVerificationStatus() == com.equiplink.entity.enums.VerificationStatus.VIDEO_VERIFIED) {
            booking.setVerificationStatus(com.equiplink.entity.enums.VerificationStatus.FULLY_VERIFIED);
        } else {
            booking.setVerificationStatus(com.equiplink.entity.enums.VerificationStatus.DOCUMENTS_VERIFIED);
        }

        bookingRepository.save(booking);
        log.info("Booking {} machinery documents verified by {}", id, currentUserEmail);
        return bookingMapper.toSummaryResponse(booking);
    }
}
