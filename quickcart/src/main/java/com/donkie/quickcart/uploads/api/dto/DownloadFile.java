package com.donkie.quickcart.uploads.api.dto;

public record DownloadFile(
        String contentType,
        byte[] bytes
) {
    public static DownloadFile of(String contentType, byte[] bytes) {
        return new DownloadFile(contentType, bytes);
    }
}
