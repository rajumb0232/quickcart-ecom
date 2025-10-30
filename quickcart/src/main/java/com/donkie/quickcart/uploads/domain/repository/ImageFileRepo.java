package com.donkie.quickcart.uploads.domain.repository;

import com.donkie.quickcart.uploads.domain.model.ImageFile;
import com.donkie.quickcart.uploads.domain.model.UploadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ImageFileRepo extends JpaRepository<ImageFile, UUID> {
    @Query(
            value = """
                    SELECT *
                    FROM image_file i
                    WHERE i.upload_status = 'UPLOAD_PENDING'
                      AND (i.created_date + make_interval(secs => i.upload_window)) < CURRENT_TIMESTAMP
                    """,
            nativeQuery = true
    )
    List<ImageFile> findExpiredButPendingUploads();


    Page<ImageFile> findByUploadStatus(UploadStatus uploadStatus, Pageable pageable);

    Optional<ImageFile> findByObjectKey(String objectKey);
}
