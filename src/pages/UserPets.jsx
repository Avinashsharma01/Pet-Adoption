import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserPets, deletePet } from "../firebase/petServices";
import { Link } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPaw, FaExclamationTriangle } from "react-icons/fa";

// Image optimization function (from your existing code)
const getOptimizedImageUrl = (
    originalUrl,
    width = 400,
    height = 300,
    quality = "auto"
) => {
    if (!originalUrl || !originalUrl.includes("cloudinary.com")) {
        return (
            originalUrl ||
            "https://via.placeholder.com/400x300?text=No+Image+Available"
        );
    }

    // Get the base URL part before 'upload/'
    const uploadIndex = originalUrl.indexOf("upload/");
    if (uploadIndex === -1) return originalUrl;

    const baseUrl = originalUrl.substring(0, uploadIndex + 7);
    const imageUrl = originalUrl.substring(uploadIndex + 7);

    // Add transformation parameters
    return `${baseUrl}c_fill,w_${width},h_${height},q_${quality},f_auto/${imageUrl}`;
};

const UserPets = () => {
    const { currentUser } = useAuth();
    const [userPets, setUserPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                if (currentUser) {
                    const pets = await getUserPets(currentUser.uid);
                    setUserPets(pets);
                }
            } catch (error) {
                console.error("Error fetching user pets:", error);
                setError("Failed to load your pets. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPets();
    }, [currentUser]);

    const handleDeleteClick = (pet) => {
        setPetToDelete(pet);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (!petToDelete) return;

            setIsDeleting(true);
            await deletePet(petToDelete.id, currentUser.uid);

            // Update local state to reflect deletion
            setUserPets(userPets.filter((pet) => pet.id !== petToDelete.id));
            toast.success("Pet deleted successfully");
        } catch (error) {
            console.error("Error deleting pet:", error);
            toast.error(error.message || "Failed to delete pet");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setPetToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Pets
                    </h1>
                    <Link
                        to="/upload-pet"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Add New Pet
                    </Link>
                </div>

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

                {userPets.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <FaPaw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No pets listed yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            You haven't listed any pets for adoption yet. Create
                            your first pet listing now.
                        </p>
                        <Link
                            to="/upload-pet"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Upload a Pet
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userPets.map((pet) => (
                            <div
                                key={pet.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                            >
                                <Link to={`/pets/${pet.id}`}>
                                    <div className="h-56 w-full overflow-hidden">
                                        <img
                                            src={getOptimizedImageUrl(
                                                pet.photoURLs?.[0]
                                            )}
                                            alt={pet.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {pet.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {pet.breed} • {pet.age} years old
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {pet.gender}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {pet.location}
                                        </p>

                                        <div className="mt-4 flex items-center">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    pet.adoptionStatus ===
                                                    "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {pet.adoptionStatus ===
                                                "available"
                                                    ? "Available"
                                                    : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <Link
                                        to={`/edit-pet/${pet.id}`}
                                        className="p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                                        title="Edit pet"
                                    >
                                        <FaEdit className="h-4 w-4 text-blue-500" />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(pet)}
                                        className="p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                        title="Delete pet"
                                    >
                                        <FaTrash className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Pet"
                    message={`Are you sure you want to delete ${petToDelete?.name}? This action cannot be undone.`}
                    isLoading={isDeleting}
                />
            </div>
        </div>
    );
};

export default UserPets;
