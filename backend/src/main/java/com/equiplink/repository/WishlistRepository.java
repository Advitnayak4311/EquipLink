package com.equiplink.repository;

import com.equiplink.entity.Wishlist;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Wishlist entity database actions.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    long countByCustomerEmail(String email);

    List<Wishlist> findByCustomerEmail(String email, Pageable pageable);

    List<Wishlist> findByCustomerEmail(String email);

    boolean existsByEquipmentIdAndCustomerEmail(Long equipmentId, String email);

    Optional<Wishlist> findByEquipmentIdAndCustomerEmail(Long equipmentId, String email);
}
