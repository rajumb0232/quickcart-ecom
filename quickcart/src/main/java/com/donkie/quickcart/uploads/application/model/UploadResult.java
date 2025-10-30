package com.donkie.quickcart.uploads.application.model;

import com.donkie.quickcart.uploads.domain.model.ImageFile;

import java.net.URL;
import java.time.Duration;

public class UploadResult {

    public record PresignedUpload(
            String objectKey,
            URL url,
            Duration uploadWindow
    ) {
    }

    public record PresignedDownload(
            URL url,
            Duration downloadWindow
    ) {
    }

    public record Summary(
            boolean isSuccessful,
            ImageFile image
    ) {
    }
}
