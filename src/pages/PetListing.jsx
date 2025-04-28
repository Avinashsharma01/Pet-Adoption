import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    // orderBy,
    doc,
    setDoc,
    deleteDoc,
    // getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FaSearch, FaFilter, FaSortAmountDown, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Cloudinary transformation function
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

const PetListing = () => {
    const [searchParams] = useSearchParams();
    const initialSearchTerm = searchParams.get("search") || "";
    const initialType = searchParams.get("type") || "";
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [filters, setFilters] = useState({
        type: initialType,
        gender: "",
        size: "",
        minAge: "",
        maxAge: "",
    });
    const [sortOption, setSortOption] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    // Fetch pets on component mount
    useEffect(() => {
        const fetchPets = async () => {
            try {
                // Option 1: If you've created the index in Firebase, keep using this query
                // const q = query(
                //     collection(db, "pets"),
                //     where("adoptable", "==", true),
                //     orderBy("createdAt", "desc")
                // );

                // Option 2: Alternate approach if you don't want to create an index
                const q = query(
                    collection(db, "pets"),
                    where("adoptable", "==", true)
                );

                const querySnapshot = await getDocs(q);
                const petsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                }));

                // Sort the data in memory after fetching
                petsData.sort((a, b) => b.createdAt - a.createdAt);

                setPets(petsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching pets:", error);
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    // Fetch user favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) {
                return;
            }

            setFavoritesLoading(true);
            try {
                const favoritesRef = collection(
                    db,
                    "users",
                    currentUser.uid,
                    "favorites"
                );
                const querySnapshot = await getDocs(favoritesRef);

                const favoritesMap = {};
                querySnapshot.forEach((doc) => {
                    favoritesMap[doc.id] = true;
                });

                setFavorites(favoritesMap);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setFavoritesLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser]);

    // Apply filters and search whenever pets, filters, or searchTerm changes
    useEffect(() => {
        if (pets.length === 0) return;

        let filtered = [...pets];

        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (pet) =>
                    pet.name.toLowerCase().includes(term) ||
                    pet.breed.toLowerCase().includes(term) ||
                    pet.description.toLowerCase().includes(term) ||
                    pet.location.toLowerCase().includes(term)
            );
        }

        // Apply type filter
        if (filters.type) {
            filtered = filtered.filter((pet) => pet.type === filters.type);
        }

        // Apply gender filter
        if (filters.gender) {
            filtered = filtered.filter((pet) => pet.gender === filters.gender);
        }

        // Apply size filter
        if (filters.size) {
            filtered = filtered.filter((pet) => pet.size === filters.size);
        }

        // Apply age range filters
        if (filters.minAge) {
            filtered = filtered.filter(
                (pet) => Number(pet.age) >= Number(filters.minAge)
            );
        }
        if (filters.maxAge) {
            filtered = filtered.filter(
                (pet) => Number(pet.age) <= Number(filters.maxAge)
            );
        }

        // Apply sorting
        if (sortOption === "newest") {
            filtered.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sortOption === "oldest") {
            filtered.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sortOption === "name_asc") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name_desc") {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredPets(filtered);
    }, [pets, filters, searchTerm, sortOption]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // The search will be applied through the useEffect
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            type: "",
            gender: "",
            size: "",
            minAge: "",
            maxAge: "",
        });
        setSearchTerm("");
    };

    const handleFavoriteToggle = async (e, petId) => {
        e.preventDefault(); // Prevent navigation to pet detail
        e.stopPropagation(); // Stop event propagation

        if (!currentUser) {
            // Redirect to login if user is not logged in
            navigate("/login");
            return;
        }

        const favoriteRef = doc(
            db,
            "users",
            currentUser.uid,
            "favorites",
            petId
        );

        try {
            if (favorites[petId]) {
                // Remove from favorites
                await deleteDoc(favoriteRef);
                setFavorites((prev) => {
                    const newFavorites = { ...prev };
                    delete newFavorites[petId];
                    return newFavorites;
                });
            } else {
                // Add to favorites - using serverTimestamp() instead of Date object
                const pet = pets.find((p) => p.id === petId);

                // Create a clean data object without any undefined or complex values
                const favoriteData = {
                    petId,
                    addedAt: new Date().toISOString(), // Convert to ISO string
                    petName: pet.name || "",
                    petImage: pet.photoURLs?.[0] || "",
                    petBreed: pet.breed || "",
                    petAge: Number(pet.age) || 0, // Ensure age is a number
                    petGender: pet.gender || "",
                    petLocation: pet.location || "",
                };

                await setDoc(favoriteRef, favoriteData);
                setFavorites((prev) => ({
                    ...prev,
                    [petId]: true,
                }));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Available Pets for Adoption
                </h1>

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        {/* Search Form */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex-grow mb-4 md:mb-0 md:mr-4"
                        >
                            <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search for pets..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white px-4 py-2 flex items-center"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </form>

                        {/* Filter Toggle Button */}
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                            >
                                <FaFilter className="mr-2" />
                                <span>
                                    {isFilterOpen
                                        ? "Hide Filters"
                                        : "Show Filters"}
                                </span>
                            </button>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(e.target.value)
                                    }
                                    className="bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name_asc">Name (A-Z)</option>
                                    <option value="name_desc">
                                        Name (Z-A)
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <FaSortAmountDown />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {isFilterOpen && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Pet Type */}
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Pet Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">All Types</option>
                                        <option value="dog">Dogs</option>
                                        <option value="cat">Cats</option>
                                        <option value="bird">Birds</option>
                                        <option value="rabbit">Rabbits</option>
                                        <option value="hamster">
                                            Hamsters
                                        </option>
                                        <option value="reptile">
                                            Reptiles
                                        </option>
                                        <option value="fish">Fish</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={filters.gender}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Any Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                {/* Size */}
                                <div>
                                    <label
                                        htmlFor="size"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Size
                                    </label>
                                    <select
                                        id="size"
                                        name="size"
                                        value={filters.size}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Any Size</option>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>

                                {/* Min Age */}
                                <div>
                                    <label
                                        htmlFor="minAge"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Min Age (years)
                                    </label>
                                    <input
                                        type="number"
                                        id="minAge"
                                        name="minAge"
                                        value={filters.minAge}
                                        onChange={handleFilterChange}
                                        min="0"
                                        step="0.1"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                {/* Max Age */}
                                <div>
                                    <label
                                        htmlFor="maxAge"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Max Age (years)
                                    </label>
                                    <input
                                        type="number"
                                        id="maxAge"
                                        name="maxAge"
                                        value={filters.maxAge}
                                        onChange={handleFilterChange}
                                        min="0"
                                        step="0.1"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-purple-600 hover:text-purple-800 font-medium"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pet Listing */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : filteredPets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPets.map((pet) => (
                            <div
                                key={pet.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                            >
                                <Link to={`/pets/${pet.id}`}>
                                    <div className="h-56 w-full overflow-hidden">
                                        <img
                                            src={
                                                getOptimizedImageUrl(
                                                    pet.photoURLs?.[0]
                                                ) ||
                                                "https://via.placeholder.com/300x200?text=No+Image+Available"
                                            }
                                            alt={pet.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {pet.name}
                                            </h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {pet.breed} • {pet.age} years old
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {pet.gender} • {pet.size}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {pet.location}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                            {pet.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                Available
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={(e) =>
                                        handleFavoriteToggle(e, pet.id)
                                    }
                                    className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md focus:outline-none ${
                                        favoritesLoading
                                            ? "opacity-50 cursor-wait"
                                            : ""
                                    }`}
                                    disabled={favoritesLoading}
                                >
                                    <FaHeart
                                        size={20}
                                        className={
                                            favorites[pet.id]
                                                ? "text-red-500"
                                                : "text-gray-400 hover:text-red-500"
                                        }
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No pets found
                        </h3>
                        <p className="text-gray-500">
                            We couldn't find any pets matching your search
                            criteria. Please try a different search or reset
                            your filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetListing;
