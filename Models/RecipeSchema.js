import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        String
    },
    youtubeUrl:{
        type: String
    },
    ingredients: [{
        type: String
    }],
    instructions: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Dessert']
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } 
}, { timestamps: true});

export default mongoose.model("Recipe", RecipeSchema);