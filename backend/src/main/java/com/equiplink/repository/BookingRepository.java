package com.equiplink.repository;

import com.equiplink.entity.Booking;
import com.equiplink.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

/**
 * Repository interface for Booking entity database actions.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    /**
     * Checks if there is any approved booking that overlaps with the requested rental dates.
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.equipment.id = :equipmentId " +
           "AND b.status = 'APPROVED' " +
           "AND :startDate <= b.endDate AND :endDate >= b.startDate")
    boolean hasOverlappingApprovedBooking(
            @Param("equipmentId") Long equipmentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    long countByEquipmentOwnerEmailAndStatus(String email, BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.customer.email = :email " +
           "AND b.equipment.id = :equipmentId " +
           "AND (b.status = com.equiplink.entity.enums.BookingStatus.APPROVED OR b.status = com.equiplink.entity.enums.BookingStatus.COMPLETED)")
    boolean hasApprovedOrCompletedBooking(
            @Param("email") String email,
            @Param("equipmentId") Long equipmentId
    );

    long countByCustomerEmail(String email);

    long countByCustomerEmailAndStatus(String email, BookingStatus status);

    long countByStatus(BookingStatus status);
}
