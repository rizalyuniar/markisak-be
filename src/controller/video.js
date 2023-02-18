const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelVideo = require('../model/video');
const modelRecipe = require('../model/recipe');

const getRecipeVideos = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const { rowCount } = await modelRecipe.findId(id_recipe);
        if (!rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get recipe videos
        const result = await modelVideo.selectRecipeVideos(id_recipe);
        
        //Return not found if there's no recipe video in database
        if (!result.rows[0]) return commonHelper.response(res, null, 404, "Recipe video not found");

        //Response
        commonHelper.response(res, result.rows, 200, "Get recipe videos successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recipe videos");
    }
}

const getDetailVideo = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");
        
        //Check if comment exists in database
        const id_video = req.params.id_video;
        const findIdVideo = await modelVideo.findId(id_video);
        if (!findIdVideo.rowCount) return commonHelper.response(res, null, 404, "Detail video not found");

        //Get detail video
        const result = await modelVideo.selectDetailVideo(id);

        //Response
        commonHelper.response(res, result.rows, 200, "Get detail video successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail video");
    }
}

const createVideo = async (req, res) => {
    try {
        //Check if recipe exists in db
        const id_recipe = req.params.id_recipe;
        const findIdRecipe = await modelRecipe.findId(id_recipe);
        if (!findIdRecipe.rowCount) return commonHelper.response(res, null, 404, "Recipe not found");

        //Get request body
        const data = req.body;

        //Video metadata
        data.id = uuidv4();
        data.id_recipe = id_recipe;

        //Insert comment
        const results = await modelComment.insertComment(data);

        //Response
        commonHelper.response(res, results.rows, 201, "Comment created");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating comment");
    }
}

const updateVideo = async (req, res) => {
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
        if(findIdComment.rows[0].id_user != req.payload.id) 
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

const deleteVideo = async (req, res) => {
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
        if(findIdComment.rows[0].id_user != req.payload.id) 
        return commonHelper.response(res, null, 403, 
            "Deleting comment created by other user is not allowed");

        //Delete comment
        const id_user = req.payload.id;
        const result = await modelComment.deleteComment(id_comment, id_recipe, );
        
        //Response
        commonHelper.response(res, result.rows, 200, "Comment deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting comment");
    }
}

module.exports = {
    getRecipeVideos,
    getDetailVideo,
    createVideo,
    updateVideo,
    deleteRecipeVideos,
    deleteVideo
}