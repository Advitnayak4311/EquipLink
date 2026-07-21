package com.equiplink.repository;

import com.equiplink.entity.EquipmentImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for EquipmentImage entity database actions.
 */
@Repository
public interface EquipmentImageRepository extends JpaRepository<EquipmentImage, Long> {
}
