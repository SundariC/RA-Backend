import express from "express";
import { upload } from "../Utils/cloudinary.js";
import { createRecipe, updateRecipe, getAllRecipes, getRecipeById, deleteRecipe } from "../Controllers/recipeController.js";

const router = express.Router();

router.post("/create-recipes", upload.single('image'), createRecipe);
router.put("/update-recipes/:id", updateRecipe);
router.get("/get-recipes/:id", getRecipeById);
router.get("/get-all-recipes", getAllRecipes);
router.delete("/delete-recipe/:id", deleteRecipe);

export default router;