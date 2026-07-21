package com.equiplink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuration class enabling Spring Data JPA Auditing.
 * Automatically tracks entity creation and modification times.
 */
@Configuration
@EnableJpaAuditing
public class AuditConfig {
}
