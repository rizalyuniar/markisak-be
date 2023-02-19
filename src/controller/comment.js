const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common.js');
const commentModel = require('../model/comment.js');
const recipeModel = require('../model/recipe.js');

const getRecipeComments = async (req, res) => {
    try {
        //Get request recipe id and pagination query
        const id_recipe = req.params.id_recipe;
        const sortBy = req.query.sortBy || 'updated_at';
        const sort = req.query.sort || 'desc';
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        
        //Check if recipe exists in database
        const resultRecipe = await recipeModel.selectRecipe(id_recipe);
        if (!resultRecipe.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Get recipe comments
        const results = await commentModel
            .selectRecipeComments(id_recipe, sortBy, sort, limit, offset);

        //Return not found if there's no recipe comments in database
        if (!results.rows[0]) return commonHelper
            .response(res, null, 404, "Recipe comments not found");

        //Pagination info
        const { rows: [count] } = await commentModel.countData();
        const totalData = Number(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get recipe comments successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipe comments");
    }
}

const getDetailComment = async (req, res) => {
    try {
        //Get request comment id and recipe id
        const id = req.params.id_comment;
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount)
            return commonHelper.response(res, null, 404, "Recipe not found");

        //Get recipe comment by id from database
        const result = await commentModel.selectComment(id);

        //Return not found if there's no recipe comment in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Recipe comment not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail comment successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail comment");
    }
}

const createComment = async (req, res) => {
    try {
        //Get request recipe id, user id, and recipe data
        const id_recipe = req.params.id_recipe;
        const id_user = req.payload.id;
        const data = req.body;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Insert comment to database
        data.id = uuidv4();
        data.id_recipe = req.params.id_recipe;
        data.id_user = id_user;
        data.created_at = Date.now();
        data.updated_at = Date.now();
        const result = await commentModel.insertComment(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Comment added");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed adding comment");
    }
}

const updateComment = async (req, res) => {
    try {
        //Get request comment id, recipe id, user id, and recipe data
        const id = req.params.id_comment;
        const id_user = req.payload.id;
        const id_recipe = req.params.id_recipe;

        const data = req.body;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if comment is created by user logged in
        const findCommentResult = await commentModel.selectComment(id);
        if (findCommentResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Updating comment created by other user is not allowed");

        //Update comment in database
        data.id = id;
        data.updated_at = Date.now();
        const result = await commentModel.updateComment(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Comment updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating comment");
    }
}

const deleteComment = async (req, res) => {
    try {
        //Get request comment id, user id, and recipe id
        const id = req.params.id_comment;
        const id_user = req.payload.id;
        const id_recipe = req.params.id_recipe;

        //Check if recipe exists in database
        const recipeResult = await recipeModel.selectRecipe(id_recipe);
        if (!recipeResult.rowCount) return commonHelper
            .response(res, null, 404, "Recipe not found");

        //Check if comment exists in database
        const findCommentResult = await commentModel.selectComment(id);
        if (!findCommentResult.rowCount) return commonHelper
            .response(res, null, 404, "Comment not found or already deleted");

        //Check if comment is created by user logged in
        if (findCommentResult.rows[0].id_user != id_user)
            return commonHelper.response(res, null, 403,
                "Deleting comment created by other user is not allowed");

        //Delete comment
        const result = await commentModel.deleteComment(id);

        //Response
        commonHelper.response(res, result.rows, 200, "Comment deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting comment");
    }
}

module.exports = {
    getRecipeComments,
    getDetailComment,
    createComment,
    updateComment,
    deleteComment
}