const { v4: uuidv4 } = require('uuid');

const modelRecipe = require('../model/recipe');
const commonHelper = require('../helper/common');

const getDetailComment = async (id) => {
    try {
        const id = req.params.id;
        const { rowCount } = await modelRecipe.findId(id);
        if (!rowCount) return res.json({ message: "Recipe not found" });

        const result = await modelRecipe.selectRecipe(id);

        commonHelper.response(res, result.rows, 200, "Get recipe successful");
    } catch (error) {
        console.log(error);
        res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

module.exports = {
    getDetailComment,

}