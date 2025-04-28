import { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { usePetForm } from "./PetFormContext";

const PhotoUploadSection = () => {
    const fileInputRef = useRef(null);
    const {
        images,
        setImages,
        previews,
        setPreviews,
        setError,
        uploadProgress,
    } = usePetForm();

    const handleImageChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            if (selectedFiles.length > 5) {
                setError("Maximum 5 images allowed");
                return;
            }

            setImages(selectedFiles);

            // Generate previews
            const newPreviews = selectedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviews(newPreviews);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Pet Images* (Maximum 5)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="images"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                            >
                                <span>Upload images</span>
                                <input
                                    id="images"
                                    name="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                            Uploading: {uploadProgress}%
                        </p>
                    </div>
                )}

                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoUploadSection;
