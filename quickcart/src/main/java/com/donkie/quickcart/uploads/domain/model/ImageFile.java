package com.donkie.quickcart.uploads.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "image_file",
        indexes = {
                @Index(name = "idx_diff_name", columnList = "differentiator_name"),
                @Index(name = "idx_upload_status", columnList = "upload_status")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class ImageFile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "image_id", nullable = false, updatable = false)
    private UUID imageId;

    @Column(name = "object_key", nullable = false, updatable = false)
    private String objectKey;

    @Column(name = "content_type", updatable = false)
    private String contentType;

    @Column(name = "differentiator_name", nullable = false, updatable = false)
    private String differentiatorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "upload_status", nullable = false)
    private UploadStatus uploadStatus = UploadStatus.UPLOAD_PENDING; // Default status on creation.

    @Column(name = "upload_window", nullable = false, updatable = false)
    private Long uploadWindow = 5 * 60L; // Default upload window of 5 mins in seconds

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private Instant createdDate;

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;

    public static ImageFile create(String contentType, String differentiatorName, Duration uploadWindow) {
        String objectKey = String.format("%s/%s", differentiatorName, UUID.randomUUID());
        var img = new ImageFile();
        img.setObjectKey(objectKey);
        img.setContentType(contentType);
        img.setDifferentiatorName(differentiatorName);
        img.setUploadWindow(uploadWindow.getSeconds());
        return img;
    }

    public void uploadCompleted() {
        this.uploadStatus = UploadStatus.UPLOAD_COMPLETE;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(createdDate.plusSeconds(uploadWindow));
    }
}
