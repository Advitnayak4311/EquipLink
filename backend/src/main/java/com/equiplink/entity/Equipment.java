package com.equiplink.entity;

import com.equiplink.entity.enums.EquipmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents heavy machinery listed by an owner for rentals.
 */
@Entity
@Table(name = "equipment", indexes = {
        @Index(name = "idx_equipment_name", columnList = "name"),
        @Index(name = "idx_equipment_category", columnList = "category_id"),
        @Index(name = "idx_equipment_location", columnList = "location"),
        @Index(name = "idx_equipment_status", columnList = "availability_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "manufacture_year", nullable = false)
    private Integer manufactureYear;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "daily_rental_price", nullable = false)
    private BigDecimal dailyRentalPrice;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private EquipmentStatus availabilityStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "power_type", nullable = false)
    @Builder.Default
    private com.equiplink.entity.enums.PowerType powerType = com.equiplink.entity.enums.PowerType.DIESEL;

    @Column(name = "battery_capacity_kwh")
    private Double batteryCapacityKwh;

    @Column(name = "charging_type")
    private String chargingType;

    @Column(name = "ev_terms_accepted")
    @Builder.Default
    private Boolean evTermsAccepted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", referencedColumnName = "id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<EquipmentImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();
}
