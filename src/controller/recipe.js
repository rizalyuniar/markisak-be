const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common.js');
const commentModel = require('../model/comment.js');
const recipeModel = require('../model/recipe.js');
const videoModel = require('../model/video.js');


const getAllRecipes = async (req, res) => {
    try {
        //Search and pagination query
        const searchParam = req.query.search || '';
        const sortBy = req.query.sortBy || 'updated_at';
        const sort = req.query.sort || 'desc';
        const limit = Number(req.query.limit) || 6;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        //Get all recipes from database
        const results = await recipeModel
            .selectAllRecipes(searchParam, sortBy, sort, limit, offset);

        //Return not found if there's no recipe in database
        if (!results.rows[0]) return commonHelper
            .response(res, null, 404, "Recipes not found");

        //Pagination info
        const { rows: [count] } = await recipeModel.countData();
        const totalData = Number(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Return if page params more than total page
        if(page > totalPage) return commonHelper
            .response(res, null, 404, "Page invalid", pagination);

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all recipes successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipes");
    }
}

const getDetailRecipe = async (req, res) => {
    try {
        //Get request recipe id
        const id = req.params.id;

        //Get recipe by id from database
        const result = await recipeModel.selectRecipe(id);

        //Return not found if there's no recipe in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Get recipe videos from database
        const resultVideos = await videoModel.selectRecipeVideos(id);
        result.rows[0].videos = resultVideos.rows;

        //Get recipe comments from database
        const resultComments = await commentModel.selectRecipeComments(id);
        result.rows[0].comments = resultComments.rows;

        //Response
        //Both recipe videos and comments will return empty array
        //If there's no recipe videos or comments in database
        commonHelper.response(res, result.rows, 200,
            "Get detail recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail recipe");
    }
}

const createRecipe = async (req, res) => {
    try {
        //Get request recipe data and recipe title
        const data = req.body;
        const title = data.title;

        //Check if recipe title already exists
        const recipeTitleResult = await recipeModel.selectRecipeTitle(title);
        if (recipeTitleResult.rows) return commonHelper
            .response(res, null, 403, "Recipe title already exists");
        
        //Get recipe photo
        if (req.file == undefined) return commonHelper
            .response(res, null, 400, "Please input photo");
        const HOST = process.env.RAILWAY_STATIC_URL;
        data.photo = `http://${HOST}/img/${req.file.filename}`;

        //Insert recipe to database
        data.id = uuidv4();
        data.id_user = req.payload.id;
        data.created_at = Date.now();
        data.updated_at = Date.now();
        const result = await recipeModel.insertRecipe(data);

        //Response
        commonHelper.response(res, [{id:data.id}], 201, "Recipe added");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed adding recipe");
    }
}

const updateRecipe = async (req, res) => {
    try {
        //Get request recipe id, user id, and recipe data
        const id = req.params.id;
        const id_user = req.payload.id;
        const data = req.body;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id);
        if (!recipeResult.rowCount)
            return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if recipe is created by user logged in
        if (recipeResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Updating recipe created by other user is not allowed");

        //Get recipe photo
        if (req.file == undefined) return commonHelper
            .response(res, null, 400, "Please input photo");
        const HOST = process.env.RAILWAY_STATIC_URL;
        data.photo = `http://${HOST}/img/${req.file.filename}`;

        //Update recipe in database
        data.id = id;
        data.updated_at = Date.now();
        const result = await recipeModel.updateRecipe(data);

        //Response
        commonHelper.response(res, [{id:data.id}], 201, "Recipe updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating recipe");
    }
}

const deleteRecipe = async (req, res) => {
    try {
        //Get request recipe id
        const id = req.params.id;
        const id_user = req.payload.id;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id);
        if (!recipeResult.rowCount)
            return commonHelper.response(res, null, 404,
                "Recipe not found or already deleted");

        //Check if recipe is created by user logged in
        if (recipeResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Deleting recipe created by other user is not allowed");

        //Delete recipe
        const result = await recipeModel.deleteRecipe(id);

        //Response
        commonHelper.response(res, result.rows, 200, "Recipe deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting recipe");
    }
}

module.exports = {
    getAllRecipes,
    getDetailRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
}