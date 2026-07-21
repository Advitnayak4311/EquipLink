package com.equiplink.repository;

import com.equiplink.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Review entity database actions.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEquipmentId(Long equipmentId);

    boolean existsByEquipmentIdAndCustomerId(Long equipmentId, Long customerId);
}
