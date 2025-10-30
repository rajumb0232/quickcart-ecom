package com.donkie.quickcart.uploads.infra.integration.s3;

import com.donkie.quickcart.uploads.infra.integration.config.AwsProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class AwsS3Config {

    private AwsCredentialsProvider credentialsProvider(AwsProperties awsProperties) {
        // Uses named profile locally (dev)
        String activeProfile = System.getProperty("spring.profiles.active", "dev");

        if ("dev".equalsIgnoreCase(activeProfile)) {
            return ProfileCredentialsProvider
                    .builder()
                    .profileName("quickcart-dev")
                    .build();
        }

        // Uses default chain in production (EC2/ECS/Lambda)
        return DefaultCredentialsProvider.builder().build();
    }

    @Bean
    public S3Client s3Client(AwsProperties awsProperties) {
        return S3Client.builder()
                .region(Region.of(awsProperties.getRegion()))
                .credentialsProvider(credentialsProvider(awsProperties))
                .build();
    }

    @Bean
    public S3Presigner s3Presigner(AwsProperties awsProperties) {
        return S3Presigner.builder()
                .region(Region.of(awsProperties.getRegion()))
                .credentialsProvider(credentialsProvider(awsProperties))
                .build();
    }
}
