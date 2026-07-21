package com.equiplink.service.impl;

import com.equiplink.dto.response.WishlistResponse;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.User;
import com.equiplink.entity.Wishlist;
import com.equiplink.entity.enums.UserRole;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.repository.WishlistRepository;
import com.equiplink.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing customer saved wishlist items.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public WishlistResponse addToWishlist(Long equipmentId, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found"));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new AccessDeniedException("Only customers can save listings to their wishlist");
        }

        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Machinery listing not found"));

        if (wishlistRepository.existsByEquipmentIdAndCustomerEmail(equipmentId, customerEmail)) {
            throw new IllegalStateException("This machinery listing is already saved in your wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .customer(customer)
                .equipment(equipment)
                .build();

        wishlistRepository.save(wishlist);
        log.info("Lessor listing {} saved to wishlist by {}", equipmentId, customerEmail);

        String imageUrl = equipment.getImages().isEmpty() ? null : equipment.getImages().get(0).getImageUrl();
        return new WishlistResponse(
                wishlist.getId(),
                equipment.getId(),
                equipment.getName(),
                equipment.getCategory().getName(),
                equipment.getLocation(),
                equipment.getDailyRentalPrice().doubleValue(),
                equipment.getAvailabilityStatus().name(),
                imageUrl,
                wishlist.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long equipmentId, String customerEmail) {
        Wishlist wishlist = wishlistRepository.findByEquipmentIdAndCustomerEmail(equipmentId, customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist entry not found"));

        wishlistRepository.delete(wishlist);
        log.info("Lessor listing {} removed from wishlist by {}", equipmentId, customerEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(String customerEmail) {
        List<Wishlist> items = wishlistRepository.findByCustomerEmail(customerEmail);
        return items.stream()
                .map(item -> {
                    Equipment equipment = item.getEquipment();
                    String imageUrl = equipment.getImages().isEmpty() ? null : equipment.getImages().get(0).getImageUrl();
                    return new WishlistResponse(
                            item.getId(),
                            equipment.getId(),
                            equipment.getName(),
                            equipment.getCategory().getName(),
                            equipment.getLocation(),
                            equipment.getDailyRentalPrice().doubleValue(),
                            equipment.getAvailabilityStatus().name(),
                            imageUrl,
                            item.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
}
