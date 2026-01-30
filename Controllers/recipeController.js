import Recipe from "../Models/RecipeSchema.js";


//1. Create the Recipes
export const createRecipe = async (req, res) => {
    try {
        const { title, image, youtubeUrl, ingredients, instructions, category, userOwner } = req.body;
        const newRecipe = new Recipe ({
            title,
            image: req.file ? req.file.path : "",
            youtubeUrl,
            ingredients,
            instructions,
            category,
            userOwner
        });
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);  
    } catch (err) {
        res.status(400).json({ message: "Error saving recipe", error: err.message});
    }
};

//2. Update the recipes
export const updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedRecipe)
    } catch (err) {
        res.status(500).json({ message: "Error updating recipe", error: err.message});
    }
};

//3. Get single recipe
export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe)
            return 
              res.status(404).json({ message: "Recipe not found"})
              res.status(200).json(recipe);
    } catch (err) {
        res.status(500).json({ message: "Error fetching recipe details", error: err.message});
    }
};

//4. Get all recipes
export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1})
        res.status(200).json(recipes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching recipes", error: err.message})
    }
};

//5. Delete recipes
export const deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Recipe deleted successfully"});
    } catch (err) {
        res.status(500).json({ message: "Error deleting recipe", error: err.message});
    }
};