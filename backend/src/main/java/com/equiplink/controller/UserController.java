package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.ChangePasswordRequest;
import com.equiplink.dto.request.UpdateProfileRequest;
import com.equiplink.dto.response.UserResponse;
import com.equiplink.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller managing authenticated user operations (me, profile edits, password changing).
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for retrieving/modifying authenticated user profiles")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get currently authenticated user profile info")
    @GetMapping("/me")
    public ResponseEntity<BaseResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserResponse response = userService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("User profile retrieved successfully", response));
    }

    @Operation(summary = "Update user profile details")
    @PutMapping("/profile")
    public ResponseEntity<BaseResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserResponse response = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(BaseResponse.success("User profile updated successfully", response));
    }

    @Operation(summary = "Change user account password")
    @PutMapping("/change-password")
    public ResponseEntity<BaseResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(BaseResponse.success("Password changed successfully"));
    }
}
