package com.equiplink.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents image attachments for heavy equipment listings.
 */
@Entity
@Table(name = "equipment_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", referencedColumnName = "id", nullable = false)
    private Equipment equipment;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}
