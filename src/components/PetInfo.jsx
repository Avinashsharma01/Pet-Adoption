import {
    FaPaw,
    FaMapMarkerAlt,
    FaVenusMars,
    FaRuler,
    FaBirthdayCake,
    FaMedkit,
    FaHeart,
} from "react-icons/fa";

const PetInfo = ({ pet }) => {
    return (
        <div className="md:w-1/2 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <button className="text-gray-400 hover:text-red-500 focus:outline-none">
                    <FaHeart size={24} />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                    <FaPaw className="mr-2 text-purple-600" />
                    <span className="capitalize">{pet.breed}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="mr-2 text-purple-600" />
                    <span>{pet.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <FaVenusMars className="mr-2 text-purple-600" />
                    <span className="capitalize">{pet.gender}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <FaRuler className="mr-2 text-purple-600" />
                    <span className="capitalize">{pet.size}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <FaBirthdayCake className="mr-2 text-purple-600" />
                    <span>
                        {pet.age} {pet.age === 1 ? "year" : "years"} old
                    </span>
                </div>
                <div className="flex items-center text-gray-700">
                    <FaMedkit className="mr-2 text-purple-600" />
                    <span>
                        {pet.medicalHistory?.vaccinated
                            ? "Vaccinated"
                            : "Not vaccinated"}
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Description
                </h2>
                <p className="text-gray-700">{pet.description}</p>
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
                    {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                </span>
            </div>
        </div>
    );
};

export default PetInfo;
