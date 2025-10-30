package com.donkie.quickcart.uploads.infra.jobs;

import com.donkie.quickcart.uploads.application.model.ObjectHead;
import com.donkie.quickcart.uploads.domain.model.ImageFile;
import com.donkie.quickcart.uploads.domain.model.UploadStatus;
import com.donkie.quickcart.uploads.domain.repository.ImageFileRepo;
import com.donkie.quickcart.uploads.infra.integration.s3.S3Service;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class HandleExpiredButPendingUploads {

    private final ImageFileRepo imageFileRepo;
    private final S3Service s3Service;

    @Scheduled(fixedDelay = 300_000) // every 5 minutes
    public void execute() {
        List<ImageFile> expired = imageFileRepo.findExpiredButPendingUploads();

        if (expired.isEmpty()) {
            log.debug("No expired pending uploads found for cleanup.");
            return;
        }

        int completedCount = 0;
        int deletedCount = 0;

        for (ImageFile file : expired) {
            try {
                var head = s3Service.doesObjectExist(file.getObjectKey());
                if (head.isPresent()) {
                    file.uploadCompleted();
                    imageFileRepo.save(file);
                    completedCount++;
                } else {
                    imageFileRepo.delete(file);
                    deletedCount++;
                }
            } catch (Exception e) {
                log.error("Error while processing expired pending upload (key: {}): {}",
                        file.getObjectKey(), e.getMessage());
            }
        }
        log.info("Resolved {} pending uploads to '{}', and '{}' deleted as expired",
                completedCount, UploadStatus.UPLOAD_COMPLETE.name(), deletedCount);
    }
}
