package com.equiplink.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * Production Database Configuration for Render / PostgreSQL.
 * Automatically converts raw postgres:// connection strings to valid JDBC jdbc:postgresql:// format.
 */
@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();

        if (url != null && !url.isBlank()) {
            if (url.startsWith("jdbc:postgres://")) {
                url = url.replace("jdbc:postgres://", "jdbc:postgresql://");
            } else if (url.startsWith("postgres://")) {
                url = url.replace("postgres://", "jdbc:postgresql://");
            } else if (url.startsWith("postgresql://") && !url.startsWith("jdbc:postgresql://")) {
                url = url.replace("postgresql://", "jdbc:postgresql://");
            }
            properties.setUrl(url);
        }

        return properties.initializeDataSourceBuilder().build();
    }
}
