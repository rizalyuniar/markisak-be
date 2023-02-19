const pool = require('../config/db');

const selectLikedRecipe = (id_recipe, sortBy, sort, limit, offset) => {
    return pool.query(`SELECT * FROM liked_recipes WHERE id_recipe='${id_recipe}' 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectDetailLikedRecipe = (id_recipe, id_liked_recipe) => {
    return pool.query(`SELECT * FROM liked_recipes WHERE id_recipe='${id_recipe}' 
        AND id='${id_liked_recipe}'`);
}

const insertLikedRecipe = (data) => {
    const { id, id_user, id_recipe, created_at } = data;
    return pool.query(`INSERT INTO liked_recipes VALUES('${id}', '${id_user}',
        '${id_recipe}', '${created_at}')`);
}

const deleteLikedRecipe = (id_recipe, id_user) => {
    return pool.query(`DELETE FROM liked_recipes WHERE id_recipe='${id_recipe}' 
        AND id_user='${id_user}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT id FROM liked_recipes WHERE id='${id}'`,
            (error, result) => !error ? resolve(result) : reject(error)));
}

const findUserLikedRecipe = (id_recipe, id_user) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT id_user FROM liked_recipes 
            WHERE id_recipe='${id_recipe}' AND id_user='${id_user}'`, 
            (error, result) => !error ? resolve(result) : reject(error)));
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(*) from liked_recipes`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectLikedRecipe,
    selectDetailLikedRecipe,
    insertLikedRecipe,
    deleteLikedRecipe,
    findId,
    findUserLikedRecipe,
    countData
}