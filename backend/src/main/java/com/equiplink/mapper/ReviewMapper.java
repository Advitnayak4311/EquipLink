package com.equiplink.mapper;

import com.equiplink.dto.ReviewDTO;
import com.equiplink.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for Review conversion.
 */
@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "equipmentId", source = "equipment.id")
    @Mapping(target = "customerId", source = "customer.id")
    ReviewDTO toDto(Review review);

    @Mapping(target = "equipment.id", source = "equipmentId")
    @Mapping(target = "customer.id", source = "customerId")
    Review toEntity(ReviewDTO dto);
}
