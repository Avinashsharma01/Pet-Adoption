import {
    collection,
    getDocs,
    doc,
    getDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    setDoc
} from "firebase/firestore";
import { db, auth } from "./config";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";

/**
 * Fetches all pets uploaded by a specific user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - Array of pet objects
 */
export const getUserPets = async (userId) => {
    try {
        const petsRef = collection(db, "pets");
        const q = query(petsRef, where("sellerId", "==", userId));
        const querySnapshot = await getDocs(q);

        const pets = [];
        querySnapshot.forEach((doc) => {
            pets.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return pets;
    } catch (error) {
        console.error("Error fetching user pets:", error);
        throw error;
    }
};

/**
 * Deletes a pet from the database
 * @param {string} petId - ID of the pet to delete
 * @param {string} userId - ID of the current user
 * @returns {Promise<Object>} - Success status
 */
export const deletePet = async (petId, userId) => {
    try {
        // 1. Check if the user is the owner of the pet
        const petDoc = await getDoc(doc(db, "pets", petId));

        if (!petDoc.exists()) {
            throw new Error("Pet not found");
        }

        const petData = petDoc.data();
        if (petData.sellerId !== userId) {
            throw new Error("You don't have permission to delete this pet");
        }

        // 2. Delete the pet document from Firestore
        await deleteDoc(doc(db, "pets", petId));

        // 3. Remove this pet from current user's favorites (we don't need to access all users)
        // This fixes the permissions issue while still ensuring the pet is removed from the
        // current user's favorites if it exists there
        try {
            const currentUserFavoriteRef = doc(db, "users", userId, "favorites", petId);
            const favSnapshot = await getDoc(currentUserFavoriteRef);

            if (favSnapshot.exists()) {
                await deleteDoc(currentUserFavoriteRef);
            }
        } catch (favoriteError) {
            // Don't throw an error if we can't delete from favorites
            // This is a non-critical operation
            console.warn("Could not remove pet from user favorites:", favoriteError);
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting pet:", error);
        throw error;
    }
};

/**
 * Removes a pet from the user's favorites
 * @param {string} userId - Current user ID
 * @param {string} petId - Pet ID to remove
 * @returns {Promise<Object>} - Success status
 */
export const removeFavorite = async (userId, petId) => {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", petId);
        await deleteDoc(favoriteRef);
        return { success: true };
    } catch (error) {
        console.error("Error removing favorite:", error);
        throw error;
    }
};

/**
 * Updates a pet's information
 * @param {string} petId - ID of the pet to update
 * @param {Object} petData - New pet data
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>} - Success status
 */
export const updatePet = async (petId, petData, userId) => {
    try {
        const petRef = doc(db, "pets", petId);
        const petDoc = await getDoc(petRef);

        if (!petDoc.exists()) {
            throw new Error("Pet not found");
        }

        const existingPet = petDoc.data();
        if (existingPet.sellerId !== userId) {
            throw new Error("You don't have permission to update this pet");
        }

        await updateDoc(petRef, {
            ...petData,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating pet:", error);
        throw error;
    }
};

/**
 * Deletes a user account and all associated data
 * @param {string} password - Current user's password for verification
 * @returns {Promise<Object>} - Success status
 */
export const deleteUserAccount = async (password) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("No user is currently signed in");
        }

        // Re-authenticate user before deletion
        const credential = EmailAuthProvider.credential(
            user.email,
            password
        );

        await reauthenticateWithCredential(user, credential);

        // Get user's pets
        const userPets = await getUserPets(user.uid);

        // Delete all user's pets
        const petDeletePromises = userPets.map(pet => deletePet(pet.id, user.uid));

        // Delete user profile document
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            petDeletePromises.push(deleteDoc(userDocRef));
        }

        // Execute all delete operations
        await Promise.all(petDeletePromises);

        // Finally, delete the user account
        await deleteUser(user);

        return { success: true };
    } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
    }
};

/**
 * Adds a pet to a user's favorites collection
 * @param {string} userId - Current user ID
 * @param {string} petId - Pet ID to add to favorites
 * @param {Object} petData - Pet data to store in favorites
 * @returns {Promise<Object>} - Success status
 */
export const addToFavorites = async (userId, petId, petData) => {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", petId);

        // Format the data consistently for favorites
        const favoriteData = {
            id: petId, // Use the same ID format
            petName: petData.name || "",
            petImage: petData.photoURLs?.[0] || "",
            petBreed: petData.breed || "",
            petAge: Number(petData.age) || 0,
            petGender: petData.gender || "",
            petLocation: petData.location || "",
            addedAt: serverTimestamp(),
        };

        await setDoc(favoriteRef, favoriteData);
        return { success: true };
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
    }
};

/**
 * Checks if a pet is in a user's favorites
 * @param {string} userId - Current user ID
 * @param {string} petId - Pet ID to check
 * @returns {Promise<boolean>} - True if in favorites
 */
export const isInFavorites = async (userId, petId) => {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", petId);
        const favoriteDoc = await getDoc(favoriteRef);
        return favoriteDoc.exists();
    } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
    }
};

/**
 * Gets all of a user's favorite pets
 * @param {string} userId - Current user ID
 * @returns {Promise<Array>} - Array of favorite pets
 */
export const getFavorites = async (userId) => {
    try {
        const favoritesRef = collection(db, "users", userId, "favorites");
        const querySnapshot = await getDocs(favoritesRef);

        const favoritesData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Handle Firestore timestamp
            let addedAtDate = new Date();

            if (data.addedAt) {
                if (typeof data.addedAt === "string") {
                    // Handle ISO string
                    addedAtDate = new Date(data.addedAt);
                } else if (data.addedAt.toDate) {
                    // Handle Firestore Timestamp
                    addedAtDate = data.addedAt.toDate();
                }
            }

            return {
                id: doc.id,
                ...data,
                addedAt: addedAtDate,
            };
        });

        // Sort by most recently added
        favoritesData.sort((a, b) => b.addedAt - a.addedAt);

        return favoritesData;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
    }
};