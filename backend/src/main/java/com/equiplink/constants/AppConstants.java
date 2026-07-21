package com.equiplink.constants;

/**
 * Global application constants.
 */
public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    // ---- API Scopes ----
    public static final String API_PREFIX = "/api";
    public static final String AUTH_PREFIX = API_PREFIX + "/auth";
    public static final String EQUIPMENT_PREFIX = API_PREFIX + "/equipment";
    public static final String BOOKING_PREFIX = API_PREFIX + "/bookings";
    public static final String WISHLIST_PREFIX = API_PREFIX + "/wishlist";
    public static final String REVIEW_PREFIX = API_PREFIX + "/reviews";

    // ---- Page Defaults ----
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    // ---- Validation ----
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_NAME_LENGTH = 100;
}
