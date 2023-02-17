const { v4: uuidv4 } = require('uuid');

const modelRecipe = require('../model/recipe');
const modelComment = require('../model/comment');
const modelVideo = require('../model/video');
const commonHelper = require('../helper/common');

const getAllRecipes = async (req, res) => {
    try {
        //Search and pagination query
        const searchParam = req.query.search || '';
        const sortBy = req.query.sortBy || 'updated_at';
        const sort = req.query.sort || 'desc';
        const limit = Number(req.query.limit) || 6;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const result = await modelRecipe.selectAllRecipes(searchParam, sortBy, sort, limit, offset);
        if (!result.rows[0]) return res.json({ message: "No recipe found" });

        //Pagination info
        const { rows: [count] } = await modelRecipe.countData();
        const totalData = Number(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        commonHelper.response(res, result.rows, 200, "Get all recipes successful", pagination);
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const getDetailRecipe = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await modelRecipe.findId(id);
        if (!rowCount) return res.json({ message: "Recipe not found" });

        const result = await modelRecipe.selectRecipe(id);

        //Get recipe videos
        const resultVideos = await modelVideo.selectRecipeVideos(id);
        const arrayVideos = resultVideos.rows;
        result.rows[0].videos = arrayVideos;

        //Get recipe comments
        const resultComments = await modelComment.selectRecipeComments(id);
        const arrayComments = resultComments.rows;
        result.rows[0].comments = arrayComments;

        commonHelper.response(res, result.rows, 200, "Get recipe successful");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const createRecipe = async (req, res) => {
    try {
        const data = req.body;
        data.id = uuidv4();
        data.id_user = '65618687-a259-41b7-947b-cb7c42302d3f'; //Dummy id_user
        const HOST = process.env.HOST || 'localhost';
        const PORT = process.env.PORT || 443;
        data.photo = `http://${HOST}:${PORT}/img/${req.file.filename}`;
        data.created_at = Date.now();
        data.updated_at = Date.now();
        const result = await modelRecipe.insertRecipe(data);

        //Recipe videos
        const videos = data.videos ? JSON.parse(data.videos) : [];
        videos.forEach(async (element, index) => {
            element.id = uuidv4();
            element.id_recipe = data.id;
            await modelVideo.insertVideo(element);
        });

        commonHelper.response(res, result.rows, 200, "Recipe created");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const updateRecipe = async (req, res) => {
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
        data.photo = `http://${HOST}:${PORT}/img/${req.file.filename}`;

        const { rows: [count] } = await modelVideo.countRecipeVideo(id);

        const videos = data.videos ? JSON.parse(data.videos) : [];
        const updateCount = videos.length;

        videos.forEach(async (element, index) => {
            if (index + 1 <= count.count) {
                await modelVideo.updateVideo(element);
            } else {
                element.id = uuidv4();
                element.id_recipe = data.id;
                await modelVideo.insertVideo(element, index + 1);
            }
        });

        //Delete videos if video update count is less than the amount in db
        const resultVideos = await modelVideo.selectRecipeVideos(id);
        const arrayVideos = resultVideos.rows;
        console.log(arrayVideos)
        arrayVideos.forEach(async (element, index) => {
            if(index + 1 > updateCount){
                await modelVideo.deleteVideo(element.id);
            }
        })

        const result = await modelRecipe.updateRecipe(data);

        commonHelper.response(res, result.rows, 200, "Recipe updated");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

const deleteRecipe = async (req, res) => {
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
    getAllRecipes,
    getDetailRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
}