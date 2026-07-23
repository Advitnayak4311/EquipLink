package com.equiplink.repository;

import com.equiplink.entity.Equipment;
import com.equiplink.entity.enums.EquipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Equipment database actions.
 */
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long>, JpaSpecificationExecutor<Equipment> {

    /**
     * Lists and filters equipment owned by a specific owner.
     */
    @Query(value = "SELECT DISTINCT e FROM Equipment e LEFT JOIN FETCH e.owner LEFT JOIN FETCH e.category WHERE LOWER(e.owner.email) = LOWER(:email) AND " +
           "(:search IS NULL OR LOWER(e.name) LIKE :search " +
           "OR LOWER(e.brand) LIKE :search " +
           "OR LOWER(e.model) LIKE :search) AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:status IS NULL OR e.availabilityStatus = :status)",
           countQuery = "SELECT COUNT(e) FROM Equipment e WHERE LOWER(e.owner.email) = LOWER(:email) AND " +
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
    @Query(value = "SELECT DISTINCT e FROM Equipment e LEFT JOIN FETCH e.owner LEFT JOIN FETCH e.category WHERE " +
           "(:search IS NULL OR LOWER(e.name) LIKE :search " +
           "OR LOWER(e.brand) LIKE :search " +
           "OR LOWER(e.model) LIKE :search) AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:status IS NULL OR e.availabilityStatus = :status)",
           countQuery = "SELECT COUNT(e) FROM Equipment e WHERE " +
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

    @Query("SELECT COUNT(e) FROM Equipment e WHERE LOWER(e.owner.email) = LOWER(:email)")
    long countByOwnerEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT COUNT(e) FROM Equipment e WHERE LOWER(e.owner.email) = LOWER(:email) AND e.availabilityStatus = :status")
    long countByOwnerEmailAndAvailabilityStatusIgnoreCase(@Param("email") String email, @Param("status") EquipmentStatus status);

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
