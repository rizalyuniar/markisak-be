const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common.js');
const recipeModel = require('../model/recipe.js');
const videoModel = require('../model/video.js');

//This controller adds, updates, deletes one video per request
//The client must send multiple request to make multiple changes to a video in recipe

const getRecipeVideos = async (req, res) => {
    try {
        //Get request recipe id
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in database
        const resultRecipe = await recipeModel.selectRecipe(id_recipe);
        if (!resultRecipe.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Get recipe videos from database
        const result = await videoModel.selectRecipeVideos(id_recipe);

        //Return not found if there's no recipe videos in database
        if (!result.rows[0]) return commonHelper
            .response(res, null, 404, "Recipe videos not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get recipe videos successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipe videos");
    }
}

const getDetailVideo = async (req, res) => {
    try {
        //Get request video id and recipe id
        const id = req.params.id_video;
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Get detail recipe video from database
        const result = await videoModel.selectVideo(id, id_recipe);

        //Return not found if there's no recipe video in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Recipe video not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get recipe video step successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipe video step");
    }
}

const createVideo = async (req, res) => {
    try {
        //Get request recipe id, user id, video step, and video data
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;
        const data = req.body;
        const step = data.step;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if recipe is created by user logged in
        if (recipeResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Adding video step in a recipe created by other user is not allowed");

        //Check if video step already exists
        const videoStepResult = await videoModel
            .selectRecipeVideoStep(id_recipe, step);
        if (videoStepResult.rowCount) return commonHelper
            .response(res, null, 403, `Video step ${step} already exists`);

        //Insert video step to database
        data.id = uuidv4();
        data.id_recipe = id_recipe;
        const results = await videoModel.insertVideo(data);

        //Response
        commonHelper.response(res, results.rows, 201,
            `Video step ${step} added`);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed adding video step");
    }
}

const updateVideo = async (req, res) => {
    try {
        //Get request video id, recipe id, user id, video step, and video data
        const id = req.params.id_video;
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;
        const data = req.body;
        const step = data.step;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if recipe video doesn't exist
        const result = await videoModel.selectVideo(id, id_recipe);
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Recipe video not found");

        //Check if recipe is created by user logged in
        if (recipeResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Updating video step in a recipe created by other user is not allowed");

        //Check if video step doesn't exist
        const videoStepResult = await videoModel
            .selectRecipeVideoStep(id_recipe, step);
        if (!videoStepResult.rowCount) return commonHelper
            .response(res, null, 404, `Video step ${step} doesn't match video id`);

        //Update video step in database
        data.id = id;
        const results = await videoModel.updateVideo(data);

        //Response
        commonHelper.response(res, results.rows, 201, `Video step ${step} updated`);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating video step");
    }
}

const deleteVideo = async (req, res) => {
    try {
        //Get request video id, recipe id, user id, and video data
        const id = req.params.id_video;
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if recipe is created by user logged in
        if (recipeResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Deleting video step in a recipe created by other user is not allowed");

        //Check if video step doesn't exist
        const videoResult = await videoModel.selectVideo(id, id_recipe);
        if (!videoResult.rowCount) return commonHelper.response(res, null, 404,
            `Video step doesn't exist or already deleted`);

        //Delete video step in database
        const results = await videoModel.deleteVideo(id);

        //Response
        const step = videoResult.rows[0].step;
        commonHelper.response(res, results.rows, 200,
            `Video step ${step} deleted`);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting video step");
    }
}

module.exports = {
    getRecipeVideos,
    getDetailVideo,
    createVideo,
    updateVideo,
    deleteVideo
}