import { FaEnvelope, FaPhone } from "react-icons/fa";

const OwnerInfo = ({ seller, pet }) => {
    return (
        <div className="md:w-1/2 md:pr-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About the Owner
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                {seller ? (
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {seller.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Member since{" "}
                            {new Date(
                                seller.createdAt?.seconds * 1000
                            ).toLocaleDateString()}
                        </p>
                        <div className="mt-4 space-y-2">
                            {pet.contactEmail && (
                                <div className="flex items-center text-gray-700">
                                    <FaEnvelope className="mr-2 text-purple-600" />
                                    <a
                                        href={`mailto:${pet.contactEmail}`}
                                        className="text-purple-600 hover:text-purple-800"
                                    >
                                        {pet.contactEmail}
                                    </a>
                                </div>
                            )}
                            {pet.contactPhone && (
                                <div className="flex items-center text-gray-700">
                                    <FaPhone className="mr-2 text-purple-600" />
                                    <a
                                        href={`tel:${pet.contactPhone}`}
                                        className="text-purple-600 hover:text-purple-800"
                                    >
                                        {pet.contactPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">
                        Owner information not available
                    </p>
                )}
            </div>
        </div>
    );
};

export default OwnerInfo;
