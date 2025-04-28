// Cloudinary configuration
// This file sets up Cloudinary and exports upload utility functions

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Your Cloudinary cloud name
// Note: In production, you should store these in environment variables
const CLOUDINARY_CLOUD_NAME = 'drucek3tt';
const CLOUDINARY_UPLOAD_PRESET = 'pet_adoption'; // Create an unsigned upload preset in your Cloudinary dashboard

/**
 * Uploads a single file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in Cloudinary
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadToCloudinary = async (file, folder, progressCallback = null) => {
    try {
        // Create a unique file name
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${fileId}.${fileExtension}`;

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);
        formData.append('public_id', fileName.replace(`.${fileExtension}`, ''));

        // Upload to Cloudinary via axios for progress tracking
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    if (progressCallback) {
                        const percentComplete = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );
                        progressCallback(percentComplete);
                    }
                },
            }
        );

        console.log('File uploaded successfully to Cloudinary:', response.data.secure_url);
        return response.data.secure_url;
    } catch (error) {
        console.error('Error in uploadToCloudinary:', error);
        throw error;
    }
};

/**
 * Uploads multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @param {string} userId - User ID for folder path
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Promise<string[]>} - Array of URLs of the uploaded images
 */
export const uploadMultipleFiles = async (files, userId, progressCallback = null) => {
    if (!files || files.length === 0) return [];

    try {
        console.log("Starting multiple file upload to Cloudinary...");

        const folderPath = `pet_adoption/${userId}`;
        const totalFiles = files.length;
        let completedFiles = 0;

        // Upload each file one at a time
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            console.log(`Uploading file ${i + 1}/${totalFiles}`);

            // Individual file progress tracker
            const fileProgressCallback = progressCallback
                ? (percent) => {
                    // Convert individual file progress to overall progress
                    const fileWeight = 1 / totalFiles;
                    const overallProgress = Math.round(
                        ((completedFiles / totalFiles) + (percent / 100 * fileWeight)) * 100
                    );
                    progressCallback(overallProgress);
                }
                : null;

            // Upload the file
            const url = await uploadToCloudinary(files[i], folderPath, fileProgressCallback);
            urls.push(url);
            completedFiles++;
            console.log(`Completed file ${i + 1}/${totalFiles}`);
        }

        console.log("All uploads completed successfully");
        return urls;
    } catch (error) {
        console.error('Error in uploadMultipleFiles:', error);
        throw error;
    }
};