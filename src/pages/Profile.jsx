/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaPaw,
    FaExclamationTriangle,
    FaCheck,
} from "react-icons/fa";

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("profile");

    // Form state for profile
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactDetails: {
            phone: "",
            address: "",
        },
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) return;

            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserProfile(userData);

                    // Initialize form data
                    setFormData({
                        name: userData.name || "",
                        email: userData.email || "",
                        contactDetails: {
                            phone: userData.contactDetails?.phone || "",
                            address: userData.contactDetails?.address || "",
                        },
                    });
                }

                // If user is a seller, fetch their pets
                if (currentUser.accountType === "seller") {
                    const petsQuery = query(
                        collection(db, "pets"),
                        where("sellerId", "==", currentUser.uid)
                    );

                    const petsSnapshot = await getDocs(petsQuery);
                    const petsData = petsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setUserPets(petsData);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setError(
                    "Failed to load profile information. Please try again."
                );
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("contactDetails.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                contactDetails: {
                    ...prev.contactDetails,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const userDocRef = doc(db, "users", currentUser.uid);

            await updateDoc(userDocRef, {
                name: formData.name,
                contactDetails: formData.contactDetails,
            });

            setSuccess("Profile updated successfully!");

            // Update userProfile state
            setUserProfile((prev) => ({
                ...prev,
                name: formData.name,
                contactDetails: formData.contactDetails,
            }));
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
            setError("Failed to log out. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    My Profile
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
                                    {success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                className={`px-6 py-4 text-sm font-medium ${
                                    activeTab === "profile"
                                        ? "border-b-2 border-purple-500 text-purple-600"
                                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() => setActiveTab("profile")}
                            >
                                <FaUser className="inline mr-2" />
                                Profile
                            </button>

                            {currentUser?.accountType === "seller" && (
                                <button
                                    className={`px-6 py-4 text-sm font-medium ${
                                        activeTab === "pets"
                                            ? "border-b-2 border-purple-500 text-purple-600"
                                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                    onClick={() => setActiveTab("pets")}
                                >
                                    <FaPaw className="inline mr-2" />
                                    My Pets
                                </button>
                            )}
                        </nav>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Full Name
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                                <FaUser className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email Address
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                                <FaEnvelope className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-50"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Email address cannot be changed.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contactDetails.phone"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                                <FaPhone className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="tel"
                                                id="contactDetails.phone"
                                                name="contactDetails.phone"
                                                value={
                                                    formData.contactDetails
                                                        .phone
                                                }
                                                onChange={handleInputChange}
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contactDetails.address"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Address
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                                <FaMapMarkerAlt className="h-4 w-4" />
                                            </span>
                                            <input
                                                type="text"
                                                id="contactDetails.address"
                                                name="contactDetails.address"
                                                value={
                                                    formData.contactDetails
                                                        .address
                                                }
                                                onChange={handleInputChange}
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Log Out
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-purple-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                            >
                                                {saving
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* My Pets Tab */}
                    {activeTab === "pets" && (
                        <div className="p-6">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Pets You've Listed
                                </h2>
                                <button
                                    onClick={() => navigate("/upload-pet")}
                                    className="bg-purple-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Add New Pet
                                </button>
                            </div>

                            {userPets.length === 0 ? (
                                <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
                                    <FaPaw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No pets listed yet
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        You haven't listed any pets for adoption
                                        yet. Create your first pet listing now.
                                    </p>
                                    <button
                                        onClick={() => navigate("/upload-pet")}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Upload a Pet
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userPets.map((pet) => (
                                        <div
                                            key={pet.id}
                                            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="h-48 w-full overflow-hidden">
                                                <img
                                                    src={
                                                        pet.photoURLs?.[0] ||
                                                        "https://via.placeholder.com/300x200?text=No+Image+Available"
                                                    }
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {pet.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                                    {pet.breed} • {pet.age}{" "}
                                                    years old
                                                </p>
                                                <div className="mt-4 flex justify-between">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            pet.adoptable
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {pet.adoptable
                                                            ? "Available"
                                                            : "Not Available"}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/pets/${pet.id}`
                                                            )
                                                        }
                                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
