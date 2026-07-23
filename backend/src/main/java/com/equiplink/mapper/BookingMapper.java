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

    @Mapping(target = "equipmentId", expression = "java(booking.getEquipment() != null ? booking.getEquipment().getId() : null)")
    @Mapping(target = "equipmentName", expression = "java(booking.getEquipment() != null ? booking.getEquipment().getName() : \"Machinery\")")
    @Mapping(target = "equipmentImageUrl", expression = "java(booking.getEquipment() != null && booking.getEquipment().getImages() != null && !booking.getEquipment().getImages().isEmpty() ? booking.getEquipment().getImages().get(0).getImageUrl() : null)")
    @Mapping(target = "machineLocation", expression = "java(booking.getEquipment() != null ? booking.getEquipment().getLocation() : \"Location Not Specified\")")
    @Mapping(target = "customerName", expression = "java(booking.getCustomer() != null ? (booking.getCustomer().getFirstName() != null ? booking.getCustomer().getFirstName() : \"\") + \" \" + (booking.getCustomer().getLastName() != null ? booking.getCustomer().getLastName() : \"\") : \"Customer\")")
    @Mapping(target = "customerEmail", expression = "java(booking.getCustomer() != null ? booking.getCustomer().getEmail() : \"\")")
    @Mapping(target = "customerLocation", expression = "java(booking.getCustomer() != null && booking.getCustomer().getCity() != null && booking.getCustomer().getState() != null ? booking.getCustomer().getCity() + \", \" + booking.getCustomer().getState() : \"Customer Regional HQ\")")
    BookingSummaryResponse toSummaryResponse(Booking booking);

    List<BookingSummaryResponse> toSummaryResponses(List<Booking> bookings);
}
