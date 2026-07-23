package com.equiplink.service.impl;

import com.equiplink.dto.response.*;
import com.equiplink.entity.Booking;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.User;
import com.equiplink.entity.Wishlist;
import com.equiplink.entity.enums.BookingStatus;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.entity.enums.UserRole;
import com.equiplink.mapper.BookingMapper;
import com.equiplink.mapper.EquipmentMapper;
import com.equiplink.mapper.UserMapper;
import com.equiplink.repository.BookingRepository;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.repository.WishlistRepository;
import com.equiplink.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service implementation for dashboard statistics and analytics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final WishlistRepository wishlistRepository;

    private final UserMapper userMapper;
    private final EquipmentMapper equipmentMapper;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalOwners = userRepository.countByRole(UserRole.OWNER);
        long totalCustomers = userRepository.countByRole(UserRole.CUSTOMER);

        long totalEquipment = equipmentRepository.count();
        long availableEquipment = equipmentRepository.countByAvailabilityStatus(EquipmentStatus.AVAILABLE);
        long bookedEquipment = equipmentRepository.countByAvailabilityStatus(EquipmentStatus.BOOKED);
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);

        // Recent listings
        List<User> recentUsersEntity = userRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
        List<UserResponse> recentUsers = recentUsersEntity.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());

        List<Equipment> recentEquipEntity = equipmentRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
        List<EquipmentSummaryResponse> recentEquipment = equipmentMapper.toSummaryResponses(recentEquipEntity);

        List<Booking> recentBookingsEntity = bookingRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
        List<BookingSummaryResponse> recentBookings = bookingMapper.toSummaryResponses(recentBookingsEntity);

        // Category distribution (Admin chart)
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        List<Object[]> categoryCounts = equipmentRepository.countEquipmentByCategory();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }

        // Booking status distribution (Admin chart)
        Map<String, Long> statusMap = new HashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            statusMap.put(status.name(), bookingRepository.countByStatus(status));
        }

        return new AdminDashboardResponse(
                totalUsers, totalOwners, totalCustomers,
                totalEquipment, availableEquipment, bookedEquipment, pendingBookings,
                recentUsers, recentEquipment, recentBookings,
                categoryMap, statusMap
        );
    }

    @Override
    @Transactional(readOnly = true)
    public OwnerDashboardResponse getOwnerDashboard(String ownerEmail) {
        String cleanEmail = ownerEmail != null ? ownerEmail.trim().toLowerCase() : "";
        long totalEquipment = equipmentRepository.countByOwnerEmailIgnoreCase(cleanEmail);
        long availableEquipment = equipmentRepository.countByOwnerEmailAndAvailabilityStatusIgnoreCase(cleanEmail, EquipmentStatus.AVAILABLE);
        long bookedEquipment = equipmentRepository.countByOwnerEmailAndAvailabilityStatusIgnoreCase(cleanEmail, EquipmentStatus.BOOKED);
        long pendingBookings = bookingRepository.countByEquipmentOwnerEmailIgnoreCaseAndStatus(cleanEmail, BookingStatus.PENDING);

        // Recent owner listed items
        List<Equipment> myEquip = equipmentRepository.findAll(
                (root, query, cb) -> cb.equal(cb.lower(root.get("owner").get("email")), cleanEmail),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        List<EquipmentSummaryResponse> recentEquipment = equipmentMapper.toSummaryResponses(myEquip);

        // Recent incoming booking requests
        List<Booking> incomingBookings = bookingRepository.findAll(
                (root, query, cb) -> cb.equal(cb.lower(root.get("equipment").get("owner").get("email")), cleanEmail),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        List<BookingSummaryResponse> recentBookings = bookingMapper.toSummaryResponses(incomingBookings);

        // Monthly bookings chart (Owner chart)
        List<Booking> allOwnerBookings = bookingRepository.findAll(
                (root, query, cb) -> cb.equal(cb.lower(root.get("equipment").get("owner").get("email")), cleanEmail)
        );
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Long> bookingsPerMonth = allOwnerBookings.stream()
                .filter(b -> b.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getCreatedAt().format(formatter),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return new OwnerDashboardResponse(
                totalEquipment, availableEquipment, bookedEquipment, pendingBookings,
                recentEquipment, recentBookings, bookingsPerMonth
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDashboardResponse getCustomerDashboard(String customerEmail) {
        String cleanEmail = customerEmail != null ? customerEmail.trim().toLowerCase() : "";
        long totalBookings = bookingRepository.countByCustomerEmailIgnoreCase(cleanEmail);
        long approvedBookings = bookingRepository.countByCustomerEmailIgnoreCaseAndStatus(cleanEmail, BookingStatus.APPROVED);
        long pendingBookings = bookingRepository.countByCustomerEmailIgnoreCaseAndStatus(cleanEmail, BookingStatus.PENDING);
        long wishlistCount = wishlistRepository.countByCustomerEmail(cleanEmail);

        // Recent customer bookings
        List<Booking> myBookings = bookingRepository.findAll(
                (root, query, cb) -> cb.equal(cb.lower(root.get("customer").get("email")), cleanEmail),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        List<BookingSummaryResponse> recentBookings = bookingMapper.toSummaryResponses(myBookings);

        // Recent saved wishlist items
        List<Wishlist> myWishlist = wishlistRepository.findByCustomerEmail(
                cleanEmail, PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<EquipmentSummaryResponse> recentWishlist = myWishlist.stream()
                .map(w -> equipmentMapper.toSummaryResponse(w.getEquipment()))
                .collect(Collectors.toList());

        return new CustomerDashboardResponse(
                totalBookings, approvedBookings, pendingBookings, wishlistCount,
                recentBookings, recentWishlist
        );
    }
}
