package com.equiplink.service.impl;

import com.equiplink.dto.request.EquipmentCreateRequest;
import com.equiplink.dto.request.EquipmentUpdateRequest;
import com.equiplink.dto.response.EquipmentImageResponse;
import com.equiplink.dto.response.EquipmentResponse;
import com.equiplink.dto.response.EquipmentSummaryResponse;
import com.equiplink.entity.Category;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.EquipmentImage;
import com.equiplink.entity.User;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.entity.enums.UserRole;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.mapper.EquipmentImageMapper;
import com.equiplink.mapper.EquipmentMapper;
import com.equiplink.repository.CategoryRepository;
import com.equiplink.repository.EquipmentImageRepository;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.service.EquipmentService;
import com.equiplink.service.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

/**
 * Service implementation for managing heavy equipment inventory.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentImageRepository equipmentImageRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UploadService uploadService;
    private final EquipmentMapper equipmentMapper;
    private final EquipmentImageMapper equipmentImageMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public EquipmentResponse createEquipment(EquipmentCreateRequest request, String ownerEmail) {
        String cleanEmail = ownerEmail != null ? ownerEmail.trim().toLowerCase() : "";
        User owner = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseGet(() -> {
                    log.info("Auto-provisioning user record for {} upon listing creation.", cleanEmail);
                    User newUser = User.builder()
                            .email(cleanEmail)
                            .firstName("Lessor")
                            .lastName("User")
                            .password(passwordEncoder.encode("localpassword"))
                            .role(UserRole.OWNER)
                            .enabled(true)
                            .emailVerified(true)
                            .build();
                    return userRepository.save(newUser);
                });

        if (owner.getRole() == UserRole.CUSTOMER) {
            log.info("Upgrading user {} from CUSTOMER to OWNER upon equipment creation.", ownerEmail);
            owner.setRole(UserRole.OWNER);
            userRepository.save(owner);
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Equipment equipment = Equipment.builder()
                .name(request.name())
                .brand(request.brand())
                .model(request.model())
                .manufactureYear(request.manufactureYear())
                .description(request.description())
                .dailyRentalPrice(request.dailyRentalPrice())
                .location(request.location())
                .availabilityStatus(request.availabilityStatus())
                .powerType(request.powerType() != null ? request.powerType() : com.equiplink.entity.enums.PowerType.DIESEL)
                .batteryCapacityKwh(request.batteryCapacityKwh())
                .chargingType(request.chargingType())
                .evTermsAccepted(request.evTermsAccepted() != null ? request.evTermsAccepted() : false)
                .owner(owner)
                .category(category)
                .build();

        // Create images and link them
        int order = 0;
        for (String url : request.imageUrls()) {
            EquipmentImage image = EquipmentImage.builder()
                    .imageUrl(url)
                    .displayOrder(order++)
                    .equipment(equipment)
                    .build();
            equipment.getImages().add(image);
        }

        equipmentRepository.save(equipment);
        log.info("Successfully listed equipment: {} by owner {}", equipment.getName(), owner.getEmail());

        return equipmentMapper.toResponse(equipment);
    }

    @Override
    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentUpdateRequest request, String currentUserEmail) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));

        validateOwnershipOrAdmin(equipment, currentUserEmail);

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        equipment.setName(request.name());
        equipment.setBrand(request.brand());
        equipment.setModel(request.model());
        equipment.setManufactureYear(request.manufactureYear());
        equipment.setDescription(request.description());
        equipment.setDailyRentalPrice(request.dailyRentalPrice());
        equipment.setLocation(request.location());
        equipment.setAvailabilityStatus(request.availabilityStatus());
        equipment.setCategory(category);

        equipmentRepository.save(equipment);
        log.info("Successfully updated equipment listing: {}", equipment.getId());

        return equipmentMapper.toResponse(equipment);
    }

    @Override
    @Transactional
    public void deleteEquipment(Long id, String currentUserEmail) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));

        validateOwnershipOrAdmin(equipment, currentUserEmail);

        // Delete files from disk first
        for (EquipmentImage image : equipment.getImages()) {
            uploadService.deleteFile(image.getImageUrl());
        }

        equipmentRepository.delete(equipment);
        log.info("Successfully deleted equipment listing: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentDetails(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));
        return equipmentMapper.toResponse(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EquipmentSummaryResponse> listMyEquipment(
            String ownerEmail, String search, Long categoryId, EquipmentStatus status, Pageable pageable
    ) {
        String searchParam = (search != null && !search.trim().isEmpty())
                ? "%" + search.trim().toLowerCase() + "%"
                : null;
        Page<Equipment> equipmentPage = equipmentRepository.findMyEquipment(ownerEmail, searchParam, categoryId, status, pageable);
        return equipmentPage.map(equipmentMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EquipmentSummaryResponse> listAllEquipment(
            String search, Long categoryId, EquipmentStatus status, Pageable pageable
    ) {
        String searchParam = (search != null && !search.trim().isEmpty())
                ? "%" + search.trim().toLowerCase() + "%"
                : null;
        Page<Equipment> equipmentPage = equipmentRepository.findAllEquipment(searchParam, categoryId, status, pageable);
        return equipmentPage.map(equipmentMapper::toSummaryResponse);
    }

    @Override
    @Transactional
    public EquipmentImageResponse uploadImage(Long id, MultipartFile file, String currentUserEmail) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));

        validateOwnershipOrAdmin(equipment, currentUserEmail);

        String fileUrl = uploadService.uploadFile(file);

        // Calculate next display order index
        int nextOrder = equipment.getImages().size();

        EquipmentImage image = EquipmentImage.builder()
                .imageUrl(fileUrl)
                .displayOrder(nextOrder)
                .equipment(equipment)
                .build();

        equipmentImageRepository.save(image);
        log.info("Uploaded and linked image to listing: {}", id);

        return equipmentImageMapper.toResponse(image);
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId, String currentUserEmail) {
        EquipmentImage image = equipmentImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image record not found"));

        validateOwnershipOrAdmin(image.getEquipment(), currentUserEmail);

        uploadService.deleteFile(image.getImageUrl());
        equipmentImageRepository.delete(image);
        log.info("Deleted image reference: {}", imageId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getOwnerDashboardStats(String ownerEmail) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", equipmentRepository.countByOwnerEmail(ownerEmail));
        stats.put("available", equipmentRepository.countByOwnerEmailAndAvailabilityStatus(ownerEmail, EquipmentStatus.AVAILABLE));
        stats.put("booked", equipmentRepository.countByOwnerEmailAndAvailabilityStatus(ownerEmail, EquipmentStatus.BOOKED));
        return stats;
    }

    private void validateOwnershipOrAdmin(Equipment equipment, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != UserRole.ADMIN && !equipment.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to manage this listing");
        }
    }
}
