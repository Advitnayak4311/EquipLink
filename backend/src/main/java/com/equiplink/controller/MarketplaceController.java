package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.response.CategoryResponse;
import com.equiplink.dto.response.EquipmentDetailResponse;
import com.equiplink.dto.response.MarketplaceEquipmentResponse;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.service.MarketplaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller exposing public endpoints for marketplace machinery search and browsing.
 */
@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
@Tag(name = "Marketplace Search & Browse", description = "Public operations for searching, filtering, and checking detailed specs")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @Operation(summary = "Query and search listed equipment with dynamic filters")
    @GetMapping
    public ResponseEntity<BaseResponse<Page<MarketplaceEquipmentResponse>>> searchMarketplace(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) EquipmentStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        Page<MarketplaceEquipmentResponse> result = marketplaceService.listMarketplaceEquipment(
                search, category, status, location, minPrice, maxPrice, sort, pageable);
        return ResponseEntity.ok(BaseResponse.success("Marketplace search retrieved", result));
    }

    @Operation(summary = "Get detailed information for a specific machinery listing")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<EquipmentDetailResponse>> getDetails(@PathVariable Long id) {
        EquipmentDetailResponse response = marketplaceService.getMarketplaceEquipmentDetails(id);
        return ResponseEntity.ok(BaseResponse.success("Machinery details retrieved", response));
    }

    @Operation(summary = "Get 4 similar machinery listings matching the same category")
    @GetMapping("/{id}/related")
    public ResponseEntity<BaseResponse<List<MarketplaceEquipmentResponse>>> getRelated(@PathVariable Long id) {
        List<MarketplaceEquipmentResponse> related = marketplaceService.getRelatedEquipment(id);
        return ResponseEntity.ok(BaseResponse.success("Related machinery retrieved", related));
    }

    @Operation(summary = "Get list of all equipment categories for filter sidebar")
    @GetMapping("/categories")
    public ResponseEntity<BaseResponse<List<CategoryResponse>>> listCategories() {
        List<CategoryResponse> categories = marketplaceService.listMarketplaceCategories();
        return ResponseEntity.ok(BaseResponse.success("Categories retrieved", categories));
    }
}
