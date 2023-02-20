const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelSavedRecipe = require('../model/savedRecipe');
const modelRecipe = require('../model/recipe');

const getAllSavedRecipe = async (req, res) => {
    try {
        //Get recipe id, params, and pagination query
        const id_recipe = req.params.id_recipe;
        const sortBy = req.query.sortBy || 'created_at';
        const sort = req.query.sort || 'desc';
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        //Check if recipe exists in database
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get Saved Recipe from database
        const result = await modelSavedRecipe.selectSavedRecipe(id_recipe, sortBy, sort, limit, offset);

        //Return not found if there's no saved recipe in database
        if (!result.rows[0]) return commonHelper.response(res, null, 404, "No one have saved this recipe");
        
        //Pagination info
        const { rows: [count] } = await modelSavedRecipe.countData(id_recipe);
        const totalData = Number(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Return if page params more than total page
        if(page > totalPage) return commonHelper
            .response(res, null, 404, "Page invalid", pagination);

        //Response
        commonHelper.response(res, result.rows, 200, "Get saved recipe successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting saved recipe");
    }
}

const getDetailSavedRecipe = async (req, res) => {
    try {
        //Get request saved recipe id and recipe
        const id = req.params.id_saved_recipe;
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");
        
        //Get detail saved recipe
        const result = await modelSavedRecipe.selectDetailSavedRecipe(id);
        console.log(result)
        //Return not found if there's no recipe in database
        if (!result.rowCount) return commonHelper.response(res, null, 404, 
            "Saved recipe not found");

        //Response
        commonHelper.response(res, result.rows, 200, 
            "Get detail saved recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail saved recipe");
    }
}

const createSavedRecipe = async (req, res) => {
    try {
        //Get request recipe id and user id
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;

        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");
        
        //Check if user already saved recipe
        const selectUserSavedRecipe = await modelSavedRecipe
            .selectUserSavedRecipe(id_recipe, id_user)
        if (selectUserSavedRecipe.rowCount) return commonHelper
            .response(res, null, 403, "User already saved recipe");

        //Saved recipe metadata
        const data = {};
        data.id = uuidv4();
        data.id_user = id_user;
        data.id_recipe = id_recipe;
        data.created_at = Date.now();

        //Insert saved recipe
        const results = await modelSavedRecipe.insertSavedRecipe(data);

        //Response
        commonHelper.response(res, results.rows, 201, "User saved recipe");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed user liking recipe");
    }
}

const deleteSavedRecipe = async (req, res) => {
    try {
        //Get request recipe id and user id
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;
        
        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if user haven't saved recipe
        const selectUserSavedRecipe = await modelSavedRecipe
            .selectUserSavedRecipe(id_recipe, id_user)
        if (!selectUserSavedRecipe.rowCount) return commonHelper
            .response(res, null, 403, "User haven't saved recipe");

        //Delete saved recipe
        const results = await modelSavedRecipe.deleteSavedRecipe(id_recipe, id_user);

        //Response
        commonHelper.response(res, results.rows, 200, "User unsaved recipe");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed user disliking recipe");
    }
}

const getUserSavedRecipes = async (req, res) => {
    try {
        //Get request user id
        const id_user = req.payload.id;

        //Check if user already saved recipe
        const result = await modelSavedRecipe.selectUserSavedRecipes(id_user);
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "User haven't saved any recipe");

        //Response
        commonHelper.response(res, result.rows, 200, 
            "Get user saved recipes successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting user saved recipes");
    }
}

module.exports = {
    getAllSavedRecipe,
    getDetailSavedRecipe,
    createSavedRecipe,
    deleteSavedRecipe,
    getUserSavedRecipes
}