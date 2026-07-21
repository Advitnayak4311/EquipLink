package com.equiplink.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service for handling file uploads (e.g. equipment pictures) to storage.
 */
public interface UploadService {

    /**
     * Uploads a file and returns its public URL.
     *
     * @param file the MultipartFile to upload
     * @return the public URL of the uploaded resource
     */
    String uploadFile(MultipartFile file);

    /**
     * Deletes a file from storage by its public URL.
     *
     * @param fileUrl the public URL of the resource to delete
     */
    void deleteFile(String fileUrl);
}
