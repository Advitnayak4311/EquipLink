package com.equiplink.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents customer reviews and ratings for equipment.
 */
@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", referencedColumnName = "id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private Integer rating; // Constraint: Rating between 1 and 5 (Zod & Jakarta validations check this)

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;
}
