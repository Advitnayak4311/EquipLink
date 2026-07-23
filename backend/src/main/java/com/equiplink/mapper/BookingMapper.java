package com.equiplink.mapper;

import com.equiplink.dto.response.BookingResponse;
import com.equiplink.dto.response.BookingSummaryResponse;
import com.equiplink.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct interface to convert between Booking entities, summaries, and responses.
 */
@Mapper(componentModel = "spring", uses = {EquipmentMapper.class, UserMapper.class})
public interface BookingMapper {

    BookingResponse toResponse(Booking booking);

    @Mapping(target = "equipmentId", source = "equipment.id")
    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "equipmentImageUrl", expression = "java(booking.getEquipment().getImages().isEmpty() ? null : booking.getEquipment().getImages().get(0).getImageUrl())")
    @Mapping(target = "machineLocation", source = "equipment.location")
    @Mapping(target = "customerName", expression = "java(booking.getCustomer().getFirstName() + \" \" + booking.getCustomer().getLastName())")
    @Mapping(target = "customerEmail", source = "customer.email")
    @Mapping(target = "customerLocation", expression = "java(booking.getCustomer().getCity() != null && booking.getCustomer().getState() != null ? booking.getCustomer().getCity() + \", \" + booking.getCustomer().getState() : \"Customer Regional HQ\")")
    BookingSummaryResponse toSummaryResponse(Booking booking);

    List<BookingSummaryResponse> toSummaryResponses(List<Booking> bookings);
}
