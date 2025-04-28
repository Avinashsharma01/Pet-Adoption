// filepath: c:\Desktop\Pet_Adoption\src\pages\Favorites.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaTrash, FaSadTear } from "react-icons/fa";

// Cloudinary transformation function (same as in PetListing)
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

const Favorites = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removeLoading, setRemoveLoading] = useState({});

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) {
                navigate("/login");
                return;
            }

            setLoading(true);
            try {
                const favoritesRef = collection(
                    db,
                    "users",
                    currentUser.uid,
                    "favorites"
                );
                const querySnapshot = await getDocs(favoritesRef);

                const favoritesData = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    // Handle both Date objects and ISO string formats
                    let addedAtDate;
                    if (data.addedAt) {
                        if (typeof data.addedAt === "string") {
                            // Handle ISO string format
                            addedAtDate = new Date(data.addedAt);
                        } else if (data.addedAt.toDate) {
                            // Handle Firestore Timestamp
                            addedAtDate = data.addedAt.toDate();
                        } else {
                            addedAtDate = new Date();
                        }
                    } else {
                        addedAtDate = new Date();
                    }

                    return {
                        id: doc.id,
                        ...data,
                        addedAt: addedAtDate,
                    };
                });

                // Sort by most recently added
                favoritesData.sort((a, b) => b.addedAt - a.addedAt);

                setFavorites(favoritesData);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser, navigate]);

    const handleRemoveFavorite = async (petId) => {
        if (!currentUser) return;

        setRemoveLoading((prev) => ({ ...prev, [petId]: true }));

        try {
            const favoriteRef = doc(
                db,
                "users",
                currentUser.uid,
                "favorites",
                petId
            );
            await deleteDoc(favoriteRef);

            // Update state
            setFavorites((prev) => prev.filter((fav) => fav.id !== petId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        } finally {
            setRemoveLoading((prev) => ({ ...prev, [petId]: false }));
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Favorite Pets
                    </h1>
                    <button
                        onClick={() => navigate("/pets")}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Find More Pets
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite) => (
                            <div
                                key={favorite.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                            >
                                <Link to={`/pets/${favorite.id}`}>
                                    <div className="h-56 w-full overflow-hidden">
                                        <img
                                            src={
                                                getOptimizedImageUrl(
                                                    favorite.petImage
                                                ) ||
                                                "https://via.placeholder.com/300x200?text=No+Image+Available"
                                            }
                                            alt={favorite.petName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {favorite.petName}
                                            </h2>
                                            <FaHeart className="text-red-500" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {favorite.petBreed} •{" "}
                                            {favorite.petAge} years old
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {favorite.petGender}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {favorite.petLocation}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Added on{" "}
                                            {favorite.addedAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() =>
                                        handleRemoveFavorite(favorite.id)
                                    }
                                    className={`absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-90 shadow-md focus:outline-none hover:bg-red-50 ${
                                        removeLoading[favorite.id]
                                            ? "opacity-50 cursor-wait"
                                            : ""
                                    }`}
                                    disabled={removeLoading[favorite.id]}
                                    title="Remove from favorites"
                                >
                                    <FaTrash
                                        size={16}
                                        className="text-red-500"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <FaSadTear className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No favorites yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            You haven't added any pets to your favorites yet.
                            Browse available pets and click the heart icon to
                            add them to your favorites.
                        </p>
                        <Link
                            to="/pets"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Browse Pets
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
