package com.equiplink.config;

import com.equiplink.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Startup runner ensuring a clean database environment with zero dummy listings or fake test data.
 * Runs AFTER CategoryDataLoader (Order 2).
 */
@Component
@RequiredArgsConstructor
@Order(2)
@Slf4j
public class EquipmentDataLoader implements CommandLineRunner {

    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        log.info("Cleaning database to ensure zero dummy data...");
        wishlistRepository.deleteAll();
        reviewRepository.deleteAll();
        bookingRepository.deleteAll();
        equipmentRepository.deleteAll();
        userRepository.deleteAll();
        log.info("Database initialized with zero dummy listings/data.");
    }
}
