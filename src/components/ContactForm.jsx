import { useState } from "react";

const ContactForm = ({ petName, initialData }) => {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            email: "",
            message: "",
        }
    );
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send the message to the seller
        // For now, we'll just simulate success
        setFormSubmitted(true);
    };

    return (
        <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact About {petName}
            </h2>
            {formSubmitted ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Your message has been sent to the owner. They
                                will contact you soon!
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-4 rounded-lg shadow-sm"
                >
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Your Name*
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Your Email*
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Message*
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows="4"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={`I'm interested in adopting ${petName}...`}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
