package com.equiplink.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Uniform wrapper class for all REST API responses.
 *
 * @param <T> type of data payload
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private int status;
    private String message;
    private T data;
    private Map<String, String> errors; // Field-level validation errors

    /**
     * Helper to create a successful response.
     */
    public static <T> BaseResponse<T> success(String message, T data) {
        return BaseResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Helper to create a successful response without data.
     */
    public static <T> BaseResponse<T> success(String message) {
        return BaseResponse.<T>builder()
                .status(200)
                .message(message)
                .build();
    }

    /**
     * Helper to create an error response.
     */
    public static <T> BaseResponse<T> error(int status, String message) {
        return BaseResponse.<T>builder()
                .status(status)
                .message(message)
                .build();
    }

    /**
     * Helper to create an error response with validation errors map.
     */
    public static <T> BaseResponse<T> error(int status, String message, Map<String, String> errors) {
        return BaseResponse.<T>builder()
                .status(status)
                .message(message)
                .errors(errors)
                .build();
    }
}
