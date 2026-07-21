package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.response.WishlistResponse;
import com.equiplink.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing REST endpoints for managing customer saved wishlist items.
 */
@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist Management", description = "Endpoints for customer to save and manage machinery listings in wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @Operation(summary = "Add equipment to wishlist (Customer only)")
    @PostMapping("/{equipmentId}")
    public ResponseEntity<BaseResponse<WishlistResponse>> add(
            @PathVariable Long equipmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        WishlistResponse response = wishlistService.addToWishlist(equipmentId, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Equipment listing saved to wishlist", response));
    }

    @Operation(summary = "Remove equipment from wishlist (Customer only)")
    @DeleteMapping("/{equipmentId}")
    public ResponseEntity<BaseResponse<Void>> remove(
            @PathVariable Long equipmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        wishlistService.removeFromWishlist(equipmentId, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Equipment listing removed from wishlist"));
    }

    @Operation(summary = "Retrieve user's saved wishlist items")
    @GetMapping
    public ResponseEntity<BaseResponse<List<WishlistResponse>>> get(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<WishlistResponse> response = wishlistService.getWishlist(userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Wishlist items retrieved successfully", response));
    }
}
