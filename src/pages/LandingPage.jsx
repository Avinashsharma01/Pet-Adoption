import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaDog, FaCat, FaFeather, FaFish } from "react-icons/fa";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [featuredPets, setFeaturedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchFeaturedPets = async () => {
            try {
                // Query for pets marked as adoptable
                const q = query(
                    collection(db, "pets"),
                    where("adoptable", "==", true),
                    limit(6)
                );

                const querySnapshot = await getDocs(q);
                const petsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setFeaturedPets(petsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching featured pets:", error);
                setLoading(false);
            }
        };

        fetchFeaturedPets();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to search results page with search term
        window.location.href = `/pets?search=${searchTerm}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="sm:text-center lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                            <span className="block">Find your perfect</span>
                            <span className="block text-purple-300">
                                furry companion
                            </span>
                        </h1>
                        <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Connect with pet owners looking to find loving homes
                            for their animals. Browse pets available for
                            adoption or list your pet for adoption.
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow">
                                <Link
                                    to="/pets"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                                >
                                    Browse Pets
                                </Link>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                {/* Only show the Register button if the user is not logged in */}
                                {!currentUser && (
                                    <Link
                                        to="/register"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:py-4 md:text-lg md:px-10"
                                    >
                                        Register Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form
                    onSubmit={handleSearch}
                    className="flex items-center justify-center"
                >
                    <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex-grow p-3">
                            <label htmlFor="search" className="sr-only">
                                Search for pets
                            </label>
                            <input
                                id="search"
                                name="search"
                                className="w-full text-lg border-none focus:ring-0"
                                placeholder="Search by pet type, breed, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="md:w-auto w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 flex items-center justify-center"
                        >
                            <FaSearch className="mr-2" />
                            <span>Search</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Pet Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                    Browse by Category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        to="/pets?type=dog"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
                    >
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <FaDog className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Dogs
                        </h3>
                        <p className="text-gray-500 text-center mt-2">
                            Loyal companions ready for their forever home
                        </p>
                    </Link>

                    <Link
                        to="/pets?type=cat"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
                    >
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <FaCat className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Cats
                        </h3>
                        <p className="text-gray-500 text-center mt-2">
                            Independent friends looking for loving owners
                        </p>
                    </Link>

                    <Link
                        to="/pets?type=bird"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
                    >
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <FaFeather className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Birds
                        </h3>
                        <p className="text-gray-500 text-center mt-2">
                            Colorful companions to brighten your day
                        </p>
                    </Link>

                    <Link
                        to="/pets?type=other"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
                    >
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <FaFish className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Other Pets
                        </h3>
                        <p className="text-gray-500 text-center mt-2">
                            Discover unique companions waiting for a home
                        </p>
                    </Link>
                </div>
            </div>

            {/* Featured Pets Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                    Featured Pets for Adoption
                </h2>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : featuredPets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPets.map((pet) => (
                            <Link
                                to={`/pets/${pet.id}`}
                                key={pet.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="h-56 w-full overflow-hidden">
                                    <img
                                        src={
                                            pet.photoURLs?.[0] ||
                                            "https://via.placeholder.com/300x200?text=No+Image+Available"
                                        }
                                        alt={pet.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {pet.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {pet.breed} • {pet.age} years old
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {pet.location}
                                    </p>
                                    <div className="mt-4">
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No featured pets available at the moment.
                    </p>
                )}

                <div className="mt-12 text-center">
                    <Link
                        to="/pets"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                        See All Pets
                    </Link>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    How It Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                            1
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Browse Pets
                        </h3>
                        <p className="text-gray-600">
                            Explore our catalog of pets available for adoption.
                            Filter by type, breed, age, and location to find
                            your perfect match.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                            2
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Contact the Owner
                        </h3>
                        <p className="text-gray-600">
                            Found a pet you love? Reach out directly to the
                            current owner to schedule a meet and greet with your
                            potential new companion.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                            3
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Adopt Your Pet
                        </h3>
                        <p className="text-gray-600">
                            Complete the adoption process and welcome your new
                            family member home. Start your journey together!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
