package com.donkie.quickcart.uploads.application.model;

import java.time.Duration;

public class UploadCommand {

    public record Create(
            String differentiatorName
    ) {
    }
}
