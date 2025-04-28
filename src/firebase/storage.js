import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './config';

/**
 * Uploads a single file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The folder path in Firebase Storage
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadToFirebase = async (file, path, progressCallback = null) => {
    try {
        // Create a unique file name
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${fileId}.${fileExtension}`;
        const fullPath = `${path}/${fileName}`;

        // Create storage reference
        const storageRef = ref(storage, fullPath);

        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Create a promise to track the upload
        const uploadPromise = new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Track upload progress if callback provided
                    if (progressCallback) {
                        const percentComplete = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        progressCallback(percentComplete);
                    }
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    // Upload completed successfully, get download URL
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('File uploaded successfully:', downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    }
                }
            );
        });

        return await uploadPromise;
    } catch (error) {
        console.error('Error in uploadToFirebase:', error);
        throw error;
    }
};

/**
 * Uploads multiple files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} userId - User ID for folder path
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Promise<string[]>} - Array of URLs of the uploaded images
 */
export const uploadMultipleFiles = async (files, userId, progressCallback = null) => {
    if (!files || files.length === 0) return [];

    try {
        console.log("Starting multiple file upload to Firebase Storage...");

        const folderPath = `pet_adoption/${userId}`;
        const totalFiles = files.length;
        let completedFiles = 0;

        // Upload each file one at a time
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            console.log(`Uploading file ${i + 1}/${totalFiles}`);

            // Individual file progress tracker
            const fileProgressCallback = progressCallback ?
                (percent) => {
                    // Convert individual file progress to overall progress
                    const fileWeight = 1 / totalFiles;
                    const overallProgress = Math.round(
                        ((completedFiles / totalFiles) + (percent / 100 * fileWeight)) * 100
                    );
                    progressCallback(overallProgress);
                } : null;

            // Upload the file
            const url = await uploadToFirebase(files[i], folderPath, fileProgressCallback);
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