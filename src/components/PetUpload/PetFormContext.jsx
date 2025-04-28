import { createContext, useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Create context
const PetFormContext = createContext(null);

// Create provider component
export const PetFormProvider = ({ children }) => {
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        age: "",
        gender: "male",
        size: "medium",
        type: "dog",
        description: "",
        medicalHistory: {
            vaccinated: false,
            sterilized: false,
            healthIssues: "",
        },
        location: "",
        contactEmail: currentUser?.email || "",
        contactPhone: "",
        adoptable: true,
    });

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes("medicalHistory.")) {
            const medicalField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                medicalHistory: {
                    ...prev.medicalHistory,
                    [medicalField]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            name: "",
            breed: "",
            age: "",
            gender: "male",
            size: "medium",
            type: "dog",
            description: "",
            medicalHistory: {
                vaccinated: false,
                sterilized: false,
                healthIssues: "",
            },
            location: "",
            contactEmail: currentUser?.email || "",
            contactPhone: "",
            adoptable: true,
        });
        setImages([]);
        setPreviews([]);
        setUploadProgress(0);
    };

    const value = {
        formData,
        setFormData,
        images,
        setImages,
        previews,
        setPreviews,
        loading,
        setLoading,
        error,
        setError,
        success,
        setSuccess,
        uploadProgress,
        setUploadProgress,
        handleChange,
        resetForm,
    };

    return (
        <PetFormContext.Provider value={value}>
            {children}
        </PetFormContext.Provider>
    );
};

// Custom hook to use the pet form context
export const usePetForm = () => {
    const context = useContext(PetFormContext);
    if (!context) {
        throw new Error("usePetForm must be used within a PetFormProvider");
    }
    return context;
};
