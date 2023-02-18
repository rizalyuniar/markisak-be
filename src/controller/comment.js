const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelComment = require('../model/comment');
const modelRecipe = require('../model/recipe');

const getRecipeComments = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const { rowCount } = await modelRecipe.findId(id_recipe);
        if (!rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get recipe comments
        const result = await modelComment.selectRecipeComments(id_recipe);

        //Response
        commonHelper.response(res, result.rows, 200, "Get recipe comments successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipe comments");
    }
}

const getDetailComment = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");
        
        //Check if comment exists in database
        const id_comment = req.params.id_comment;
        const findIdComment = await modelComment.findId(id_comment);
        if (!findIdComment.rowCount) return commonHelper.response(res, null, 404, "Comment not found");

        //Get detail comment
        const result = await modelComment.selectComment(id_recipe, id_comment);

        //Response
        commonHelper.response(res, result.rows, 200, "Get detail comment successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail comment");
    }
}

const createComment = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get request body
        const data = req.body;

        //Comment metadata
        data.id = uuidv4();
        data.id_user = req.payload.id;
        data.id_recipe = req.params.id_recipe;
        data.created_at = Date.now();
        data.updated_at = Date.now();

        //Insert comment
        const results = await modelComment.insertComment(data);

        //Response
        commonHelper.response(res, results.rows, 201, "Comment created");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating comment");
    }
}

const updateComment = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if comment exists in database
        const id_comment = req.params.id_comment;
        const findIdComment = await modelComment.findId(id_comment);
        if (!findIdComment.rowCount) return commonHelper.response(res, null, 404, "Comment not found");

        //Check if comment is created by user logged in
        if(findIdComment.rows[0].id != req.payload.id) 
        return commonHelper.response(res, null, 403, 
            "Updating comment created by other user is not allowed");
        
        //Get request body
        const data = req.body;

        //Comment metadata
        data.id = id_comment;
        data.id_user = req.payload.id;
        data.id_recipe = id_recipe;
        data.updated_at = Date.now();
        
        //Update comment
        const results = await modelComment.updateComment(data);

        //Response
        commonHelper.response(res, results.rows, 201, "Comment updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating comment");
    }
}

const deleteComment = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Check if comment exists in database
        const id_comment = req.params.id_comment;
        const findIdComment = await modelComment.findId(id_comment);
        if (!findIdComment.rowCount) return commonHelper.response(res, null, 404, "Comment not found");

        //Check if comment is created by user logged in
        if(findIdComment.rows[0].id != req.payload.id) 
        return commonHelper.response(res, null, 403, 
            "Deleting comment created by other user is not allowed");

        //Delete comment
        const result = await modelComment.deleteComment(id_comment);
        
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