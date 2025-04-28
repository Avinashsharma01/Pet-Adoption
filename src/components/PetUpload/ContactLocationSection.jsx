import { usePetForm } from "./PetFormContext";

const ContactLocationSection = () => {
    const { formData, handleChange } = usePetForm();

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact & Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Location*
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="City, State"
                    />
                </div>

                <div>
                    <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Contact Email*
                    </label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Contact Phone
                    </label>
                    <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="adoptable"
                        name="adoptable"
                        type="checkbox"
                        checked={formData.adoptable}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="adoptable"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        This pet is currently available for adoption
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ContactLocationSection;
