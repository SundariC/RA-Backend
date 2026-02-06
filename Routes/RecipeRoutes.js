import express from "express";
import { upload } from "../Utils/cloudinary.js";
import { createRecipe, updateRecipe, getAllRecipes, getRecipeById, deleteRecipe, getUserRecipes } from "../Controllers/recipeController.js";

const router = express.Router();

router.post("/create-recipes", upload.single('image'), createRecipe);
router.put("/update-recipes/:id", upload.single("image"), updateRecipe);
router.get("/get-recipes/:id", getRecipeById);
router.get("/get-all-recipes", getAllRecipes);
router.delete("/delete-recipes/:id", deleteRecipe);
router.get("/user/:userId", getUserRecipes);

export default router;