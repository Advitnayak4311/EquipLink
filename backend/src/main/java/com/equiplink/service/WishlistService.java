package com.equiplink.service;

import com.equiplink.dto.response.WishlistResponse;

import java.util.List;

/**
 * Service contract for wishlist operations.
 */
public interface WishlistService {

    WishlistResponse addToWishlist(Long equipmentId, String customerEmail);

    void removeFromWishlist(Long equipmentId, String customerEmail);

    List<WishlistResponse> getWishlist(String customerEmail);
}
