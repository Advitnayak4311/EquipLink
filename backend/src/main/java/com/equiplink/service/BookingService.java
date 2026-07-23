package com.equiplink.service;

import com.equiplink.dto.request.BookingRequest;
import com.equiplink.dto.response.BookingResponse;
import com.equiplink.dto.response.BookingSummaryResponse;
import com.equiplink.entity.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service contract for equipment rental Booking operations.
 */
public interface BookingService {

    BookingResponse createBooking(BookingRequest request, String customerEmail);

    Page<BookingSummaryResponse> listMyBookings(String customerEmail, Pageable pageable);

    Page<BookingSummaryResponse> listOwnerBookings(
            String ownerEmail, String search, BookingStatus status, Pageable pageable);

    BookingResponse getBookingDetails(Long id, String currentUserEmail);

    BookingResponse approveBooking(Long id, String ownerEmail);

    BookingResponse rejectBooking(Long id, String ownerEmail);

    BookingResponse cancelBooking(Long id, String customerEmail);

    BookingSummaryResponse verifyVideoInspection(Long id, String currentUserEmail);

    BookingSummaryResponse verifyDocuments(Long id, String currentUserEmail);
}
