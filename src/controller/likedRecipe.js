const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelLikedRecipe = require('../model/likedRecipe');
const modelRecipe = require('../model/recipe');

const getAllLikedRecipe = async (req, res) => {
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

        //Get Liked Recipe from database
        const result = await modelLikedRecipe.selectLikedRecipe(id_recipe, sortBy, sort, limit, offset);

        //Return not found if there's no liked recipe in database
        if (!result.rows[0]) return commonHelper.response(res, null, 404, "No one have liked this recipe");

        //Pagination info
        const { rows: [count] } = await modelLikedRecipe.countData(id_recipe);
        const totalData = Number(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Response
        commonHelper.response(res, result.rows, 200, "Get liked recipe successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting liked recipe");
    }
}

const getDetailLikedRecipe = async (req, res) => {
    try {
        //Get request liked recipe id and recipe
        const id = req.params.id_liked_recipe;
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");
        
        //Get detail liked recipe
        const result = await modelLikedRecipe.selectDetailLikedRecipe(id);
        
        //Return not found if there's no recipe in database
        if (!result.rowCount) return commonHelper.response(res, null, 404, 
            "Liked recipe not found");

        //Response
        commonHelper.response(res, result.rows, 200, 
            "Get detail liked recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail liked recipe");
    }
}

const createLikedRecipe = async (req, res) => {
    try {
        //Get request recipe id and user id
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;

        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");
        
        //Check if user already liked recipe
        const selectUserLikedRecipe = await modelLikedRecipe
            .selectUserLikedRecipe(id_recipe, id_user)
        if (selectUserLikedRecipe.rowCount) return commonHelper
            .response(res, null, 403, "User already liked recipe");

        //Liked recipe metadata
        const data = {};
        data.id = uuidv4();
        data.id_user = id_user;
        data.id_recipe = id_recipe;
        data.created_at = Date.now();

        //Insert liked recipe
        const results = await modelLikedRecipe.insertLikedRecipe(data);

        //Response
        commonHelper.response(res, results.rows, 201, "User liked recipe");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed user liking recipe");
    }
}

const deleteLikedRecipe = async (req, res) => {
    try {
        //Get request recipe id and user id
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;
        
        //Check if recipe exists in db
        const recipeResults = await modelRecipe.selectRecipe(id_recipe);
        if (!recipeResults.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if user haven't liked recipe
        const selectUserLikedRecipe = await modelLikedRecipe
            .selectUserLikedRecipe(id_recipe, id_user)
        if (!selectUserLikedRecipe.rowCount) return commonHelper
            .response(res, null, 403, "User haven't liked recipe");

        //Delete liked recipe
        const results = await modelLikedRecipe.deleteLikedRecipe(id_recipe, id_user);

        //Response
        commonHelper.response(res, results.rows, 200, "User disliked recipe");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed user disliking recipe");
    }
}

module.exports = {
    getAllLikedRecipe,
    getDetailLikedRecipe,
    createLikedRecipe,
    deleteLikedRecipe
}