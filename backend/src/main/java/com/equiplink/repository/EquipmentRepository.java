package com.equiplink.repository;

import com.equiplink.entity.Equipment;
import com.equiplink.entity.enums.EquipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

/**
 * Repository interface for Equipment database actions.
 */
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long>, JpaSpecificationExecutor<Equipment> {

    /**
     * Lists and filters equipment owned by a specific owner.
     */
    @Query("SELECT e FROM Equipment e WHERE e.owner.email = :email AND " +
           "(:search IS NULL OR LOWER(e.name) LIKE :search " +
           "OR LOWER(e.brand) LIKE :search " +
           "OR LOWER(e.model) LIKE :search) AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:status IS NULL OR e.availabilityStatus = :status)")
    Page<Equipment> findMyEquipment(
            @Param("email") String email,
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("status") EquipmentStatus status,
            Pageable pageable
    );

    /**
     * Public browsing of equipment with search and filters.
     */
    @Query("SELECT e FROM Equipment e WHERE " +
           "(:search IS NULL OR LOWER(e.name) LIKE :search " +
           "OR LOWER(e.brand) LIKE :search " +
           "OR LOWER(e.model) LIKE :search) AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:status IS NULL OR e.availabilityStatus = :status)")
    Page<Equipment> findAllEquipment(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("status") EquipmentStatus status,
            Pageable pageable
    );

    long countByOwnerEmail(String email);

    long countByOwnerEmailAndAvailabilityStatus(String email, EquipmentStatus status);

    long countByAvailabilityStatus(EquipmentStatus status);

    @Query("SELECT e.category.name, COUNT(e) FROM Equipment e GROUP BY e.category.name")
    List<Object[]> countEquipmentByCategory();

    @Query("SELECT e FROM Equipment e WHERE e.category.id = :categoryId AND e.id <> :id AND e.availabilityStatus = 'AVAILABLE'")
    List<Equipment> findRelatedEquipment(
            @Param("categoryId") Long categoryId,
            @Param("id") Long id,
            Pageable pageable
    );
}
