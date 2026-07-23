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

    @Mapping(target = "ownerName", expression = "java(equipment.getOwner() != null ? (equipment.getOwner().getFirstName() != null ? equipment.getOwner().getFirstName() : \"\") + \" \" + (equipment.getOwner().getLastName() != null ? equipment.getOwner().getLastName() : \"\") : \"Equipment Owner\")")
    @Mapping(target = "categoryName", expression = "java(equipment.getCategory() != null ? equipment.getCategory().getName() : \"General Machinery\")")
    EquipmentSummaryResponse toSummaryResponse(Equipment equipment);

    List<EquipmentSummaryResponse> toSummaryResponses(List<Equipment> equipment);
}
