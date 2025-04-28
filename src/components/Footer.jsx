import {
    FaPaw,
    FaHeart,
    FaEnvelope,
    FaFacebook,
    FaTwitter,
    FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center">
                            <FaPaw className="h-8 w-8 text-purple-400" />
                            <span className="ml-2 text-xl font-bold">
                                PetConnect
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-300">
                            Connecting pet lovers with pets in need of loving
                            homes. Our mission is to help every pet find their
                            forever family.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/pets"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Browse Pets
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Pet Care Tips
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Adoption Guide
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Success Stories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Pet Health
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FaEnvelope className="text-purple-400 mr-2" />
                                <a
                                    href="mailto:info@petconnect.com"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    info@petconnect.com
                                </a>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-purple-400"
                                >
                                    <FaFacebook size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-purple-400"
                                >
                                    <FaTwitter size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-purple-400"
                                >
                                    <FaInstagram size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} PetConnect. All rights
                        reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <a
                            href="#"
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
