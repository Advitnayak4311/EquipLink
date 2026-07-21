package com.equiplink.mapper;

import com.equiplink.dto.CategoryDTO;
import com.equiplink.entity.Category;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper for Category conversion.
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toDto(Category category);
    Category toEntity(CategoryDTO dto);
}
