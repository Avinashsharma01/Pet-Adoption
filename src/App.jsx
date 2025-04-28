import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PetUpload from "./pages/PetUpload";
import PetListing from "./pages/PetListing";
import PetDetail from "./pages/PetDetail";
import Favorites from "./pages/Favorites";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import "./App.css";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/pets" element={<PetListing />} />
                            <Route path="/pets/:id" element={<PetDetail />} />
                            <Route
                                path="/favorites"
                                element={
                                    <PrivateRoute>
                                        <Favorites />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/upload-pet"
                                element={
                                    <PrivateRoute>
                                        <PetUpload />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
