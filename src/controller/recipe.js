const { v4: uuidv4 } = require('uuid');

const modelRecipe = require('../model/recipe');
const modelComment = require('../model/comment');
const modelVideo = require('../model/video');
const commonHelper = require('../helper/common');

const getAllRecipes = async (req, res) => {
    try {
        //Search, params, and pagination query
        const searchParam = req.query.search || '';
        const sortBy = req.query.sortBy || 'updated_at';
        const sort = req.query.sort || 'desc';
        const limit = Number(req.query.limit) || 6;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        //Check if recipe exists in database
        const result = await modelRecipe.selectAllRecipes(searchParam, sortBy, sort, limit, offset);
        if (!result.rows[0]) return commonHelper.response(res, null, 404, "Recipe not found");

        //Pagination info
        const totalData = Number(result.rowCount);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Response
        commonHelper.response(res, result.rows, 200, "Get all recipes successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipes");
    }
}

const getDetailRecipe = async (req, res) => {
    try {
        //Check if recipe exists in database
        const id = req.params.id;
        const { rowCount } = await modelRecipe.findId(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get recipe by id
        const result = await modelRecipe.selectRecipe(id);

        //Get recipe videos
        const resultVideos = await modelVideo.selectRecipeVideos(id);
        const arrayVideos = resultVideos.rows;
        result.rows[0].videos = arrayVideos;

        //Get recipe comments
        const resultComments = await modelComment.selectRecipeComments(id);
        const arrayComments = resultComments.rows;
        result.rows[0].comments = arrayComments;

        //Response
        commonHelper.response(res, result.rows, 200, "Get detail recipe successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail recipe");
    }
}

const createRecipe = async (req, res) => {
    try {
        //Get request body
        const data = req.body;

        //Recipe metadata
        data.id = uuidv4();
        data.id_user = req.payload.id;
        data.created_at = Date.now();
        data.updated_at = Date.now();

        //Recipe photo
        if(req.file == undefined) return commonHelper.response(res, null, 400, "Please input photo");
        const HOST = process.env.HOST || 'localhost';
        const PORT = process.env.PORT || 443;
        data.photo = `http://${HOST}:${PORT}/img/${req.file.filename}`;

        //Insert recipe
        const result = await modelRecipe.insertRecipe(data);

        //Recipe videos
        const videos = data.videos ? JSON.parse(data.videos) : [];
        videos.forEach(async (element) => {
            element.id = uuidv4();
            element.id_recipe = data.id;
            await modelVideo.insertVideo(element);
        });

        //Response
        commonHelper.response(res, result.rows, 201, "Recipe created");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating recipe");
    }
}

const updateRecipe = async (req, res) => {
    try {
        //Check if recipe exists in database
        const id = req.params.id;
        const findIdResults = await modelRecipe.findId(id);
        if (!findIdResults.rowCount) 
            return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if recipe is created by user logged in
        if(findIdResults.rows[0].id_user != req.payload.id) 
            return commonHelper.response(res, null, 403, 
                "Updating recipe created by other user is not allowed");
        
        //Get request body
        const data = req.body;
        
        //Recipe metadata
        data.id = req.params.id;
        data.id_user = req.payload.id;
        data.updated_at = Date.now();

        //Recipe photo
        if(req.file == undefined) return commonHelper.response(res, null, 400, "Please input photo");
        const HOST = process.env.HOST || 'localhost';
        const PORT = process.env.PORT || 443;
        data.photo = `http://${HOST}:${PORT}/img/${req.file.filename}`;

        //Delete recipe videos
        await modelVideo.deleteRecipeVideos(id);

        //Add recipe videos
        const videos = data.videos ? JSON.parse(data.videos) : [];
        videos.forEach(async (element) => {
            element.id = uuidv4();
            element.id_recipe = data.id;
            await modelVideo.insertVideo(element);
        });
        
        //Update recipe
        const result = await modelRecipe.updateRecipe(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Recipe updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating recipe");
    }
}

const deleteRecipe = async (req, res) => {
    try {
        //Check if recipe exists in database
        const id = req.params.id;
        const findIdResults = await modelRecipe.findId(id);
        if (!findIdResults.rowCount) 
            return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if recipe is created by user logged in
        if(findIdResults.rows[0].id_user != req.payload.id) 
            return commonHelper.response(res, null, 403, 
                "Deleting recipe created by other user is not allowed");

        //Delete recipe
        const result = await modelRecipe.deleteRecipe(id);
        
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