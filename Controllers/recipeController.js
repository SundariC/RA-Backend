import Recipe from "../Models/RecipeSchema.js";


//1. Create the Recipes
// export const createRecipe = async (req, res) => {
//     try {
//         const { title, description, image, youtubeUrl, ingredients, instructions, category, userOwner } = req.body;
//         const imageUrl = req.file ? req.file.path : "";
//         const newRecipe = new Recipe ({
//             title,
//             description,
//             image,
//             youtubeUrl,
//             ingredients,
//             instructions,
//             category,
//             userOwner,
//             image: imageUrl,
//         });
//       const savedRecipe = await newRecipe.save();
//       res.status(201).json(savedRecipe);  
//     } catch (err) {
//         res.status(400).json({ message: "Error saving recipe", error: err.message});
//     }
// };
export const createRecipe = async (req, res) => {
    try {
        const { title, description, youtubeUrl, ingredients, instructions, category, userOwner } = req.body;
        const imageUrl = req.file ? req.file.path : "";

        // Backend side conversion
        const newRecipe = new Recipe({
            title,
            description,
            youtubeUrl,
            category, // Must be 'Veg', 'Non-Veg', or 'Dessert'
            userOwner,
            image: imageUrl,
            // Check if they are strings before splitting
            ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients,
            instructions: typeof instructions === 'string' ? instructions.split(',').map(i => i.trim()) : instructions,
        });

        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);  
    } catch (err) {
        // Intha log unga backend terminal-la enna error-nu clear-ah kaatum
        console.log("Validation Error:", err.message);
        res.status(400).json({ message: "Error saving recipe", error: err.message });
    }
};

//2. Update the recipes
// export const updateRecipe = async (req, res) => {
//     try {
//         const updatedRecipe = await Recipe.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true }
//         );
//         res.status(200).json(updatedRecipe)
//     } catch (err) {
//         res.status(500).json({ message: "Error updating recipe", error: err.message});
//     }
// };

// Example Backend Logic
// 
export const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        // req.body-la irukura details-ah update panni, 'new: true' valiya update aana data-va vanganum
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json({ message: "Recipe Updated Successfully!", updatedRecipe });
    } catch (err) {
        res.status(500).json({ message: "Update Error", error: err.message });
    }
};

//3. Get single recipe
export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return 
              res.status(404).json({ message: "Recipe not found"});
}
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

//6. User recipes
export const getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userOwner: req.params.userId });
        res.status(200).json(recipes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user recipes", error: err.message });
    }
};