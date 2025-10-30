package com.donkie.quickcart.uploads.infra.integration.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "app.services.aws")
@Getter
@Setter
public class AwsProperties {
    private String region;
    private S3 s3;

    @Getter
    @Setter
    public static class S3 {
        private String bucket;
        private Presign presign;

        @Getter
        @Setter
        public static class Presign {
            private Duration downloadTtl;
            private Duration uploadTtl;
        }
    }
}
