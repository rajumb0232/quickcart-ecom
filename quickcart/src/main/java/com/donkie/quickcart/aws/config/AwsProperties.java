package com.donkie.quickcart.aws.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.services.aws")
@Getter
@Setter
public class AwsProperties {
    private String region;
    private S3 s3;

    @Getter @Setter
    public static class S3 {
        private String bucket;
    }
}
