package com.equiplink.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Startup runner ensuring a clean database environment with zero dummy listings or fake test data.
 * Does not auto-delete real user listings or user accounts on restart.
 * Runs AFTER CategoryDataLoader (Order 2).
 */
@Component
@RequiredArgsConstructor
@Order(2)
@Slf4j
public class EquipmentDataLoader implements CommandLineRunner {

    @Override
    public void run(String... args) {
        log.info("Database initialized safely with zero dummy listings.");
    }
}
