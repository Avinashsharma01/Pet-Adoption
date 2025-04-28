import { usePetForm } from "./PetFormContext";

const MedicalInformationSection = () => {
    const { formData, handleChange } = usePetForm();

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medical Information
            </h2>

            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        id="vaccinated"
                        name="medicalHistory.vaccinated"
                        type="checkbox"
                        checked={formData.medicalHistory.vaccinated}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="vaccinated"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        This pet is vaccinated
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="sterilized"
                        name="medicalHistory.sterilized"
                        type="checkbox"
                        checked={formData.medicalHistory.sterilized}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="sterilized"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        This pet is spayed/neutered
                    </label>
                </div>

                <div>
                    <label
                        htmlFor="healthIssues"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Health Issues/Special Needs
                    </label>
                    <textarea
                        id="healthIssues"
                        name="medicalHistory.healthIssues"
                        value={formData.medicalHistory.healthIssues}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Describe any health issues, medications, or special needs the pet may have."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default MedicalInformationSection;
