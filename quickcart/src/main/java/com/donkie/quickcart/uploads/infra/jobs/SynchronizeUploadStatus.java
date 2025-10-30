package com.donkie.quickcart.uploads.infra.jobs;

import com.donkie.quickcart.uploads.application.model.ObjectHead;
import com.donkie.quickcart.uploads.domain.model.ImageFile;
import com.donkie.quickcart.uploads.domain.model.UploadStatus;
import com.donkie.quickcart.uploads.domain.repository.ImageFileRepo;
import com.donkie.quickcart.uploads.infra.integration.s3.S3Service;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SynchronizeUploadStatus {

    private final ImageFileRepo imageFileRepo;
    private final S3Service s3Service;

    /**
     * Periodically checks all pending uploads to see if they've been uploaded
     * to S3 (but not confirmed by the client).
     * If found in S3, update the record to UPLOAD_COMPLETE.
     */
    @Scheduled(cron = "0 * * * * *") // every 1 minute
    public void execute() {
        int pageNumber = 0;
        int totalCompleted = 0;

        while (true) {
            Pageable pageable = PageRequest.of(pageNumber, 100);
            Page<ImageFile> page = imageFileRepo.findByUploadStatus(UploadStatus.UPLOAD_PENDING, pageable);

            if (page.isEmpty()) break;

            for (ImageFile record : page) {
                if (trySynchronizingStatus(record)) totalCompleted++;
            }

            if (!page.hasNext()) break;
            pageNumber++;
        }

        log.info("Synchronization completed — {} uploads marked as '{}'.",
                totalCompleted, UploadStatus.UPLOAD_COMPLETE.name());
    }

    @Transactional
    private boolean trySynchronizingStatus(ImageFile uploadRecord) {
        try {
            // Check only if upload window still open (don’t bother with expired)
            var head = s3Service.doesObjectExist(uploadRecord.getObjectKey());
            if (!uploadRecord.isExpired() && head.isPresent()) {
                uploadRecord.uploadCompleted();
                imageFileRepo.save(uploadRecord);
                return true;
            }
        } catch (Exception e) {
            log.error("Upload status synchronization failed (key: {}): {}",
                    uploadRecord.getObjectKey(), e.getMessage());
        }
        return false;
    }
}
