import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaPaw, FaUserCircle } from "react-icons/fa";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <FaPaw className="h-8 w-8 text-purple-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                PetConnect
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                                Home
                            </Link>
                            <Link
                                to="/pets"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                                Find Pets
                            </Link>
                            {currentUser ? (
                                <>
                                    <Link
                                        to="/favorites"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                    >
                                        Favorites
                                    </Link>
                                    <Link
                                        to="/upload-pet"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                    >
                                        Upload Pet
                                    </Link>
                                    <div className="relative ml-3">
                                        <div className="flex items-center">
                                            <button
                                                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                onClick={() =>
                                                    setIsOpen(!isOpen)
                                                }
                                            >
                                                {currentUser.photoURL ? (
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src={
                                                            currentUser.photoURL
                                                        }
                                                        alt="User profile"
                                                    />
                                                ) : (
                                                    <FaUserCircle className="h-8 w-8 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {isOpen && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 z-10 ring-black ring-opacity-5">
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Your Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-3 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        >
                            {isOpen ? (
                                <FaTimes className="block h-6 w-6" />
                            ) : (
                                <FaBars className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                        >
                            Home
                        </Link>
                        <Link
                            to="/pets"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                        >
                            Find Pets
                        </Link>
                        {currentUser ? (
                            <>
                                <Link
                                    to="/favorites"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Favorites
                                </Link>
                                <Link
                                    to="/upload-pet"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Upload Pet
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Your Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
