package com.equiplink.service;

import com.equiplink.dto.request.EquipmentCreateRequest;
import com.equiplink.dto.request.EquipmentUpdateRequest;
import com.equiplink.dto.response.EquipmentImageResponse;
import com.equiplink.dto.response.EquipmentResponse;
import com.equiplink.dto.response.EquipmentSummaryResponse;
import com.equiplink.entity.enums.EquipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Service contract for heavy equipment management.
 */
public interface EquipmentService {

    EquipmentResponse createEquipment(EquipmentCreateRequest request, String ownerEmail);

    EquipmentResponse updateEquipment(Long id, EquipmentUpdateRequest request, String currentUserEmail);

    void deleteEquipment(Long id, String currentUserEmail);

    EquipmentResponse getEquipmentDetails(Long id);

    Page<EquipmentSummaryResponse> listMyEquipment(
            String ownerEmail, String search, Long categoryId, EquipmentStatus status, Pageable pageable);

    Page<EquipmentSummaryResponse> listAllEquipment(
            String search, Long categoryId, EquipmentStatus status, Pageable pageable);

    EquipmentImageResponse uploadImage(Long id, MultipartFile file, String currentUserEmail);

    void deleteImage(Long imageId, String currentUserEmail);

    Map<String, Long> getOwnerDashboardStats(String ownerEmail);
}
