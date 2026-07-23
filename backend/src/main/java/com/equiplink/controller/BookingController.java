package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.BookingRequest;
import com.equiplink.dto.response.BookingResponse;
import com.equiplink.dto.response.BookingSummaryResponse;
import com.equiplink.entity.enums.BookingStatus;
import com.equiplink.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing REST endpoints for rental booking requests and approvals.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Operations", description = "Endpoints for customer rental requests and owner workflow actions")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Submit a new booking request (Customer only)")
    @PostMapping
    public ResponseEntity<BaseResponse<BookingResponse>> create(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.createBooking(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Booking request submitted successfully", response));
    }

    @Operation(summary = "List booking requests submitted by the logged-in customer")
    @GetMapping("/my")
    public ResponseEntity<BaseResponse<Page<BookingSummaryResponse>>> listMyBookings(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Page<BookingSummaryResponse> response = bookingService.listMyBookings(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(BaseResponse.success("My booking requests retrieved", response));
    }

    @Operation(summary = "List incoming booking requests for the logged-in owner")
    @GetMapping("/owner")
    public ResponseEntity<BaseResponse<Page<BookingSummaryResponse>>> listOwnerBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Page<BookingSummaryResponse> response = bookingService.listOwnerBookings(
                userDetails.getUsername(), search, status, pageable);
        return ResponseEntity.ok(BaseResponse.success("Incoming booking requests retrieved", response));
    }

    @Operation(summary = "Get details of a specific booking record")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<BookingResponse>> getDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.getBookingDetails(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Booking details retrieved", response));
    }

    @Operation(summary = "Approve a pending booking request (Owner only)")
    @PutMapping("/{id}/approve")
    public ResponseEntity<BaseResponse<BookingResponse>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.approveBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Booking request approved successfully", response));
    }

    @Operation(summary = "Reject a pending booking request (Owner only)")
    @PutMapping("/{id}/reject")
    public ResponseEntity<BaseResponse<BookingResponse>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.rejectBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Booking request rejected successfully", response));
    }

    @Operation(summary = "Cancel a pending booking request (Customer only)")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BaseResponse<BookingResponse>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Booking request cancelled successfully", response));
    }

    @Operation(summary = "Complete live video inspection verification for a booking")
    @PostMapping("/{id}/verify-video")
    public ResponseEntity<BaseResponse<BookingSummaryResponse>> verifyVideo(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingSummaryResponse response = bookingService.verifyVideoInspection(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Live video inspection verified successfully", response));
    }

    @Operation(summary = "Complete machinery document verification for a booking")
    @PostMapping("/{id}/verify-documents")
    public ResponseEntity<BaseResponse<BookingSummaryResponse>> verifyDocuments(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingSummaryResponse response = bookingService.verifyDocuments(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Machinery documents verified successfully", response));
    }
}
