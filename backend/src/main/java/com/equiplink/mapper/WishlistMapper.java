package com.equiplink.mapper;

import com.equiplink.dto.WishlistDTO;
import com.equiplink.entity.Wishlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for Wishlist conversion.
 */
@Mapper(componentModel = "spring")
public interface WishlistMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "equipmentId", source = "equipment.id")
    WishlistDTO toDto(Wishlist wishlist);

    @Mapping(target = "customer.id", source = "customerId")
    @Mapping(target = "equipment.id", source = "equipmentId")
    Wishlist toEntity(WishlistDTO dto);
}
