package com.equiplink.mapper;

import com.equiplink.dto.response.UserResponse;
import com.equiplink.entity.User;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper for User conversion.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    User toEntity(UserResponse response);
}
