package com.equiplink.service.impl;

import com.equiplink.dto.response.CategoryResponse;
import com.equiplink.dto.response.EquipmentDetailResponse;
import com.equiplink.dto.response.MarketplaceEquipmentResponse;
import com.equiplink.entity.Category;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.mapper.MarketplaceMapper;
import com.equiplink.repository.CategoryRepository;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.service.MarketplaceService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for marketplace catalog operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceServiceImpl implements MarketplaceService {

    private final EquipmentRepository equipmentRepository;
    private final CategoryRepository categoryRepository;
    private final MarketplaceMapper marketplaceMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<MarketplaceEquipmentResponse> listMarketplaceEquipment(
            String search,
            Long categoryId,
            EquipmentStatus status,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            Pageable pageable
    ) {
        Specification<Equipment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchPattern),
                        cb.like(cb.lower(root.get("brand")), searchPattern),
                        cb.like(cb.lower(root.get("model")), searchPattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("availabilityStatus"), status));
            }

            if (location != null && !location.trim().isEmpty()) {
                String locationPattern = "%" + location.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), locationPattern));
            }

            if (minPrice != null) {
                predicates.add(cb.ge(root.get("dailyRentalPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.le(root.get("dailyRentalPrice"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Custom sort parsing
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null) {
            switch (sort) {
                case "oldest" -> sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
                case "priceAsc" -> sortOrder = Sort.by(Sort.Direction.ASC, "dailyRentalPrice");
                case "priceDesc" -> sortOrder = Sort.by(Sort.Direction.DESC, "dailyRentalPrice");
                case "nameAsc" -> sortOrder = Sort.by(Sort.Direction.ASC, "name");
            }
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
        Page<Equipment> equipmentPage = equipmentRepository.findAll(spec, sortedPageable);

        return equipmentPage.map(marketplaceMapper::toMarketplaceResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentDetailResponse getMarketplaceEquipmentDetails(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));
        return marketplaceMapper.toDetailResponse(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarketplaceEquipmentResponse> getRelatedEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment listing not found"));

        List<Equipment> related = equipmentRepository.findRelatedEquipment(
                equipment.getCategory().getId(),
                id,
                PageRequest.of(0, 4)
        );

        return related.stream()
                .map(marketplaceMapper::toMarketplaceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> listMarketplaceCategories() {
        List<Category> categories = categoryRepository.findAll();
        return marketplaceMapper.toCategoryResponses(categories);
    }
}
