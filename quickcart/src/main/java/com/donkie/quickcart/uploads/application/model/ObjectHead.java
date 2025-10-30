package com.donkie.quickcart.uploads.application.model;

public record ObjectHead (
        boolean isPresent,
        String contentType
) {
    public static ObjectHead notFound() {
        return new ObjectHead(false, null);
    }
    public static ObjectHead found(String contentType) {
        return new ObjectHead(true, contentType);
    }
}
