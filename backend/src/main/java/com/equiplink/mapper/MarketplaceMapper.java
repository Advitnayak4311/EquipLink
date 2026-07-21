package com.equiplink.mapper;

import com.equiplink.dto.response.CategoryResponse;
import com.equiplink.dto.response.EquipmentDetailResponse;
import com.equiplink.dto.response.MarketplaceEquipmentResponse;
import com.equiplink.entity.Category;
import com.equiplink.entity.Equipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct interface to convert between Equipment entities and Marketplace responses.
 */
@Mapper(componentModel = "spring", uses = {EquipmentImageMapper.class})
public interface MarketplaceMapper {

    @Mapping(target = "ownerName", expression = "java(equipment.getOwner().getFirstName() + \" \" + equipment.getOwner().getLastName())")
    @Mapping(target = "categoryName", source = "category.name")
    MarketplaceEquipmentResponse toMarketplaceResponse(Equipment equipment);

    @Mapping(target = "ownerName", expression = "java(equipment.getOwner().getFirstName() + \" \" + equipment.getOwner().getLastName())")
    @Mapping(target = "ownerEmail", source = "owner.email")
    @Mapping(target = "ownerPhone", source = "owner.phone")
    @Mapping(target = "categoryName", source = "category.name")
    EquipmentDetailResponse toDetailResponse(Equipment equipment);

    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toCategoryResponses(List<Category> categories);
}
