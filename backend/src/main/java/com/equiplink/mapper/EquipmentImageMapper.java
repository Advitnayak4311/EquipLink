package com.equiplink.mapper;

import com.equiplink.dto.response.EquipmentImageResponse;
import com.equiplink.entity.EquipmentImage;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * MapStruct interface to convert between EquipmentImage entities and responses.
 */
@Mapper(componentModel = "spring")
public interface EquipmentImageMapper {

    EquipmentImageResponse toResponse(EquipmentImage image);

    List<EquipmentImageResponse> toResponses(List<EquipmentImage> images);
}
