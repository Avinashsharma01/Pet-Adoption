import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    // collection,
    // getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { FaPaw, FaHeart } from "react-icons/fa";

// Import Components
import PetImageGallery from "../components/PetImageGallery";
import OwnerInfo from "../components/OwnerInfo";
import ContactForm from "../components/ContactForm";

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [pet, setPet] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    useEffect(() => {
        const fetchPetAndSeller = async () => {
            try {
                // Fetch pet data
                const petDocRef = doc(db, "pets", id);
                const petDocSnap = await getDoc(petDocRef);

                if (!petDocSnap.exists()) {
                    setError("Pet not found");
                    setLoading(false);
                    return;
                }

                const petData = {
                    id: petDocSnap.id,
                    ...petDocSnap.data(),
                    createdAt:
                        petDocSnap.data().createdAt?.toDate() || new Date(),
                };

                setPet(petData);

                // Fetch seller data
                const sellerId = petData.sellerId;
                if (sellerId) {
                    const sellerDocRef = doc(db, "users", sellerId);
                    const sellerDocSnap = await getDoc(sellerDocRef);

                    if (sellerDocSnap.exists()) {
                        setSeller({
                            id: sellerDocSnap.id,
                            ...sellerDocSnap.data(),
                        });
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching pet details:", error);
                setError("Failed to load pet details. Please try again.");
                setLoading(false);
            }
        };

        fetchPetAndSeller();
    }, [id]);

    // Check if pet is in user's favorites
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!currentUser || !id) return;

            setFavoritesLoading(true);
            try {
                const favoriteRef = doc(
                    db,
                    "users",
                    currentUser.uid,
                    "favorites",
                    id
                );
                const favoriteDoc = await getDoc(favoriteRef);
                setIsFavorite(favoriteDoc.exists());
            } catch (error) {
                console.error("Error checking favorite status:", error);
            } finally {
                setFavoritesLoading(false);
            }
        };

        checkFavoriteStatus();
    }, [currentUser, id]);

    const handleFavoriteToggle = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        setFavoritesLoading(true);
        const favoriteRef = doc(db, "users", currentUser.uid, "favorites", id);

        try {
            if (isFavorite) {
                // Remove from favorites
                await deleteDoc(favoriteRef);
                setIsFavorite(false);
            } else {
                // Add to favorites with proper data formatting
                const favoriteData = {
                    petId: id,
                    addedAt: new Date().toISOString(), // Store as ISO string instead of Date object
                    petName: pet.name || "",
                    petImage: pet.photoURLs?.[0] || "",
                    petBreed: pet.breed || "",
                    petAge: Number(pet.age) || 0, // Ensure age is a number
                    petGender: pet.gender || "",
                    petLocation: pet.location || "",
                };

                await setDoc(favoriteRef, favoriteData);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setFavoritesLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaPaw className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/pets")}
                    className="bg-purple-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Back to Pets
                </button>
            </div>
        );
    }

    if (!pet) {
        return null;
    }

    const contactFormInitialData = {
        name: currentUser?.displayName || "",
        email: currentUser?.email || "",
        message: "",
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/pets")}
                        className="text-purple-600 hover:text-purple-800 flex items-center"
                    >
                        <span className="mr-2">←</span> Back to Pets
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        {/* Pet Images */}
                        <PetImageGallery
                            photoURLs={pet.photoURLs}
                            petName={pet.name}
                        />

                        {/* Pet Details */}
                        <div className="md:w-1/2 p-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {pet.name}
                                </h1>
                                <button
                                    onClick={handleFavoriteToggle}
                                    disabled={favoritesLoading}
                                    className={`text-gray-400 hover:text-red-500 focus:outline-none ${
                                        favoritesLoading
                                            ? "opacity-50 cursor-wait"
                                            : ""
                                    }`}
                                >
                                    <FaHeart
                                        size={24}
                                        className={
                                            isFavorite
                                                ? "text-red-500"
                                                : "text-gray-400 hover:text-red-500"
                                        }
                                    />
                                </button>
                            </div>

                            {/* Rest of PetInfo component content */}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-700">
                                    <FaPaw className="mr-2 text-purple-600" />
                                    <span className="capitalize">
                                        {pet.breed}
                                    </span>
                                </div>
                                {/* ...rest of the pet info as before... */}
                            </div>

                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Description
                                </h2>
                                <p className="text-gray-700">
                                    {pet.description}
                                </p>
                            </div>

                            {pet.medicalHistory?.healthIssues && (
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Health Information
                                    </h2>
                                    <p className="text-gray-700">
                                        {pet.medicalHistory.healthIssues}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex flex-wrap gap-2">
                                {pet.medicalHistory?.vaccinated && (
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Vaccinated
                                    </span>
                                )}
                                {pet.medicalHistory?.sterilized && (
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        Spayed/Neutered
                                    </span>
                                )}
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    {pet.type.charAt(0).toUpperCase() +
                                        pet.type.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Seller Section */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="md:flex md:justify-between">
                            {/* Owner Information */}
                            <OwnerInfo seller={seller} pet={pet} />

                            {/* Contact Form */}
                            <ContactForm
                                petName={pet.name}
                                initialData={contactFormInitialData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetail;
