import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadMultipleFiles } from "../cloudinary";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";

// Import our modular components
import {
    PetFormProvider,
    usePetForm,
} from "../components/PetUpload/PetFormContext";
import PetInformationSection from "../components/PetUpload/PetInformationSection";
import MedicalInformationSection from "../components/PetUpload/MedicalInformationSection";
import PhotoUploadSection from "../components/PetUpload/PhotoUploadSection";
import ContactLocationSection from "../components/PetUpload/ContactLocationSection";

// Create the form content component separate from the provider
const PetUploadForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);

    const {
        formData,
        images,
        loading,
        error,
        success,
        setLoading,
        setError,
        setSuccess,
        setUploadProgress,
        resetForm,
    } = usePetForm();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setUploadProgress(0);

        if (!currentUser) {
            setError("You must be logged in to upload a pet");
            return;
        }

        if (images.length === 0) {
            setError("Please upload at least one image of your pet");
            return;
        }

        setLoading(true);

        try {
            console.log("Starting image uploads to Cloudinary...");

            // Upload images using our Cloudinary utility function
            const photoURLs = await uploadMultipleFiles(
                images,
                currentUser.uid,
                (progress) => setUploadProgress(progress)
            );

            console.log(
                "Images uploaded successfully to Cloudinary:",
                photoURLs
            );

            // Add pet document to Firestore
            await addDoc(collection(db, "pets"), {
                ...formData,
                photoURLs,
                sellerId: currentUser.uid,
                createdAt: serverTimestamp(),
            });

            setSuccess(true);
            resetForm();

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

            setTimeout(() => {
                navigate("/pets");
            }, 2000);
        } catch (error) {
            console.error("Error uploading pet:", error);
            setError(`Failed to upload pet: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Upload a Pet for Adoption
            </h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaCheck className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Pet was successfully listed for adoption!
                                Redirecting...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <PetInformationSection />
                <MedicalInformationSection />
                <PhotoUploadSection />
                <ContactLocationSection />

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "List Pet for Adoption"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Wrap the form with the context provider
const PetUpload = () => {
    return (
        <PetFormProvider>
            <PetUploadForm />
        </PetFormProvider>
    );
};

export default PetUpload;
