package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.EquipmentCreateRequest;
import com.equiplink.dto.request.EquipmentUpdateRequest;
import com.equiplink.dto.response.EquipmentImageResponse;
import com.equiplink.dto.response.EquipmentResponse;
import com.equiplink.dto.response.EquipmentSummaryResponse;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.service.EquipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import com.equiplink.service.UploadService;

/**
 * Controller exposing endpoints for creating, editing, viewing, and deleting heavy equipment listings.
 */
@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@Tag(name = "Equipment Management", description = "Endpoints for owner listing operations and public browsing")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final UploadService uploadService;

    @Operation(summary = "Create a new equipment listing (Owner only)")
    @PostMapping
    public ResponseEntity<BaseResponse<EquipmentResponse>> create(
            @Valid @RequestBody EquipmentCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EquipmentResponse response = equipmentService.createEquipment(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Equipment listing created successfully", response));
    }

    @Operation(summary = "Browse and search all listed equipment")
    @GetMapping
    public ResponseEntity<BaseResponse<Page<EquipmentSummaryResponse>>> listAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) EquipmentStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        Page<EquipmentSummaryResponse> response = equipmentService.listAllEquipment(search, categoryId, status, pageable);
        return ResponseEntity.ok(BaseResponse.success("Equipment listings retrieved", response));
    }

    @Operation(summary = "Get detailed information for a specific equipment listing")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<EquipmentResponse>> getDetails(@PathVariable Long id) {
        EquipmentResponse response = equipmentService.getEquipmentDetails(id);
        return ResponseEntity.ok(BaseResponse.success("Equipment details retrieved", response));
    }

    @Operation(summary = "Update an existing equipment listing")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<EquipmentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EquipmentResponse response = equipmentService.updateEquipment(id, request, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Equipment listing updated successfully", response));
    }

    @Operation(summary = "Delete an equipment listing")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        equipmentService.deleteEquipment(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Equipment listing deleted successfully"));
    }

    @Operation(summary = "List equipment owned by the currently logged-in user")
    @GetMapping("/my")
    public ResponseEntity<BaseResponse<Page<EquipmentSummaryResponse>>> listMyEquipment(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) EquipmentStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Page<EquipmentSummaryResponse> response = equipmentService.listMyEquipment(
                userDetails.getUsername(), search, categoryId, status, pageable);
        return ResponseEntity.ok(BaseResponse.success("My equipment listings retrieved", response));
    }

    @Operation(summary = "Retrieve dashboard counters for listed fleet")
    @GetMapping("/my/stats")
    public ResponseEntity<BaseResponse<Map<String, Long>>> getMyStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Map<String, Long> stats = equipmentService.getOwnerDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Owner fleet dashboard statistics retrieved", stats));
    }

    @Operation(summary = "Upload image file and link to equipment listing")
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<EquipmentImageResponse>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EquipmentImageResponse response = equipmentService.uploadImage(id, file, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Image uploaded successfully", response));
    }

    @Operation(summary = "General file upload (returns public URL)")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<String>> uploadTempFile(
            @RequestParam("file") MultipartFile file
    ) {
        String fileUrl = uploadService.uploadFile(file);
        return ResponseEntity.ok(BaseResponse.success("File uploaded successfully", fileUrl));
    }

    @Operation(summary = "Delete image linked to equipment listing")
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<BaseResponse<Void>> deleteImage(
            @PathVariable Long imageId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        equipmentService.deleteImage(imageId, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Image deleted successfully"));
    }
}
