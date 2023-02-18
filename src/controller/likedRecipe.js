const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelLikedRecipe = require('../model/likedRecipe');
const modelRecipe = require('../model/recipe');

const getLikedRecipe = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const { rowCount } = await modelRecipe.findId(id_recipe);
        if (!rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get Liked Recipe
        const result = await modelLikedRecipe.selectLikedRecipe(id_recipe);

        //Response
        commonHelper.response(res, result.rows, 200, "Get liked recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting liked recipe");
    }
}

const getDetailLikedRecipe = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");
        
        //Check if liked recipe exists in database
        const id_liked_recipe = req.params.id_liked_recipe;
        const findIdLikedRecipe = await modelLikedRecipe.findId(id_liked_recipe);
        if (!findIdLikedRecipe.rowCount) return commonHelper.response(res, null, 404, "Liked recipe not found");

        //Get detail liked recipe
        const result = await modelLikedRecipe.selectDetailLikedRecipe(id_recipe, id_liked_recipe);

        //Response
        commonHelper.response(res, result.rows, 200, "Get detail liked recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail liked recipe");
    }
}

const createLikedRecipe = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if user already liked recipe
        const id_user = req.payload.id;
        const findUserLikedRecipe = await modelLikedRecipe.findUserLikedRecipe(id_recipe, id_user)
        if (findUserLikedRecipe.rowCount) 
            return commonHelper.response(res, null, 403, "User already liked recipe");

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
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if user haven't liked recipe
        const id_user = req.payload.id;
        const findUserLikedRecipe = await modelLikedRecipe.findUserLikedRecipe(id_recipe, id_user)
        if (!findUserLikedRecipe.rowCount) 
            return commonHelper.response(res, null, 403, "User haven't liked recipe");

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
    getLikedRecipe,
    getDetailLikedRecipe,
    createLikedRecipe,
    deleteLikedRecipe
}