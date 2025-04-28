# Pet Adoption Platform

A full-featured web application that connects pets in need with loving homes. Built with React, Firebase, and Cloudinary.

## 🐾 Features

- **Browse Pet Listings**: View all available pets with filtering options
- **Detailed Pet Profiles**: See complete information about each pet
- **User Authentication**: Register and login to access personalized features
- **Favorites System**: Save pets you're interested in
- **Pet Upload**: Shelter owners can add new pets to the platform
- **Image Management**: Upload and store pet images with Cloudinary
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Cloudinary account

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/pet-adoption.git
   cd pet-adoption
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and Cloudinary credentials:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_API_KEY=your-api-key
   VITE_CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
pet-adoption/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other resources
│   ├── cloudinary/      # Cloudinary configuration and utilities
│   ├── components/      # Reusable UI components
│   ├── context/         # React context (Auth, etc.)
│   ├── firebase/        # Firebase configuration and services
│   ├── pages/           # Application pages
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 📱 Main Pages

- **Landing Page**: Introduction to the platform and featured pets
- **Pet Listing**: Browse all available pets with filters
- **Pet Detail**: View complete information about a pet
- **Login/Register**: User authentication pages
- **Profile**: User profile management
- **Favorites**: View and manage saved pets
- **Pet Upload**: Form for adding new pets to the platform

## 🔧 Technologies Used

- **Frontend**: React, React Router, TailwindCSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Image Storage**: Cloudinary
- **Build Tool**: Vite

## 🔒 Authentication

The application uses Firebase Authentication for user management, with the following features:
- Email/password registration and login
- Authentication state persistence
- Protected routes for authenticated users

## 📷 Image Upload

Pet images are stored in Cloudinary for optimized delivery and transformations. The upload process:
1. Images are selected via file input
2. Uploaded to Cloudinary using their API
3. Image URLs are stored in Firebase along with pet data

## 🚀 Deployment

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy to your hosting service of choice (Firebase Hosting recommended)
   ```bash
   firebase deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/your-username/pet-adoption](https://github.com/your-username/pet-adoption)
