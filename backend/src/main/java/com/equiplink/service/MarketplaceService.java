package com.equiplink.service;

import com.equiplink.dto.response.CategoryResponse;
import com.equiplink.dto.response.EquipmentDetailResponse;
import com.equiplink.dto.response.MarketplaceEquipmentResponse;
import com.equiplink.entity.enums.EquipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service contract for marketplace browsing operations.
 */
public interface MarketplaceService {

    Page<MarketplaceEquipmentResponse> listMarketplaceEquipment(
            String search,
            Long categoryId,
            EquipmentStatus status,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            Pageable pageable
    );

    EquipmentDetailResponse getMarketplaceEquipmentDetails(Long id);

    List<MarketplaceEquipmentResponse> getRelatedEquipment(Long id);

    List<CategoryResponse> listMarketplaceCategories();
}
