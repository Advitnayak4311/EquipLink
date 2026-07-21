package com.equiplink.mapper;

import com.equiplink.dto.response.EquipmentResponse;
import com.equiplink.dto.response.EquipmentSummaryResponse;
import com.equiplink.entity.Equipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct interface to convert between Equipment entities, summaries, and responses.
 */
@Mapper(componentModel = "spring", uses = {EquipmentImageMapper.class, UserMapper.class, CategoryMapper.class})
public interface EquipmentMapper {

    EquipmentResponse toResponse(Equipment equipment);

    @Mapping(target = "ownerName", expression = "java(equipment.getOwner().getFirstName() + \" \" + equipment.getOwner().getLastName())")
    @Mapping(target = "categoryName", source = "category.name")
    EquipmentSummaryResponse toSummaryResponse(Equipment equipment);

    List<EquipmentSummaryResponse> toSummaryResponses(List<Equipment> equipment);
}
