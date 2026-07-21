package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.CategoryDTO;
import com.equiplink.entity.Category;
import com.equiplink.mapper.CategoryMapper;
import com.equiplink.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller to fetch equipment categories.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Endpoints for retrieving equipment categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Operation(summary = "Get list of all equipment categories")
    @GetMapping
    public ResponseEntity<BaseResponse<List<CategoryDTO>>> listAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> dtos = categories.stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(BaseResponse.success("Categories retrieved successfully", dtos));
    }
}
