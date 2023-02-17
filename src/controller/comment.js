const { v4: uuidv4 } = require('uuid');

const commonHelper = require('../helper/common');
const modelComment = require('../model/comment');
const modelRecipe = require('../model/recipe');

const getRecipeComments = async (req, res) => {
    try {
        const id_recipe = req.params.id;
        const { rowCount } = await modelRecipe.findId(id_recipe);
        if (!rowCount) return res.json({ message: "Recipe not found" });

        const result = await modelComment.selectRecipeComments(id_recipe);

        commonHelper.response(res, result.rows, 200, "Get comments in recipe successful");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const getDetailComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await modelComment.findId(id);
        if (!rowCount) return res.json({ message: "Comment not found" });

        const result = await modelComment.selectComment(id);

        commonHelper.response(res, result.rows, 200, "Get comment successful");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const createComment = async (req, res) => {
    try {
        const data = req.body;
        data.id = uuidv4();
        data.id_user = '944a76e0-dbb6-406c-986d-d8b181e27ac8'; //Dummy id_user
        data.created_at = Date.now();
        data.updated_at = Date.now();
        await modelRecipe.insertRecipe(data);

        const getCreated = await modelRecipe.selectRecipe(data.id);
        commonHelper.response(res, getCreated.rows, 200, "Recipe created");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await modelRecipe.findId(id);
        if (!rowCount) return res.json({ message: "Recipe not found" });

        const data = req.body;
        data.id = id;
        data.id_user = '944a76e0-dbb6-406c-986d-d8b181e27ac8'; //Dummy id_user
        data.updated_at = Date.now();
        const HOST = process.env.HOST || 'localhost';
        const PORT = process.env.PORT || 443;
        // data.photo = `http://${HOST}:${PORT}/img/${req.file.filename}`;
        data.photo = `http://${HOST}:${PORT}/img/${data.photo}`;




        const { rows: [count] } = await modelVideo.countRecipeVideo(id);
        const updateCount = data.videos.length;
        // const excess = updateCount - count.count;
        data.videos.forEach(async (element, index) => {
            await modelVideo.updateVideo(element);
            // if (excess > 0) {
            //     await modelRecipe.insertVideo(element);
            // }
        });

        const remainder = count.count - updateCount;
        
        if (remainder > 0) {
            for (let i = 1; i <= remainder; i++) {
                await modelVideo.deleteVideo(id, updateCount + i);
            }
        }

        await modelRecipe.updateRecipe(data);
        const getUpdated = await modelRecipe.selectRecipe(id);
        commonHelper.response(res, getUpdated.rows, 200, "Recipe updated");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await modelRecipe.findId(id);
        if (!rowCount) return res.json({ message: "Recipe not found" });

        const result = await modelRecipe.deleteRecipe(id);
        commonHelper.response(res, result.rows, 200, "Recipe deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

module.exports = {
    getRecipeComments,
    getDetailComment,
    createComment,
    updateComment,
    deleteComment
}