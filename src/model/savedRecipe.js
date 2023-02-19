const pool = require('../config/db');

const selectSavedRecipe = (id_recipe, sortBy, sort, limit, offset) => {
    return pool.query(`SELECT * FROM saved_recipes WHERE id_recipe='${id_recipe}' 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectDetailSavedRecipe = (id_recipe, id_saved_recipe) => {
    return pool.query(`SELECT * FROM saved_recipes WHERE id_recipe='${id_recipe}' 
        AND id='${id_saved_recipe}'`);
}

const insertSavedRecipe = (data) => {
    const { id, id_user, id_recipe, created_at } = data;
    return pool.query(`INSERT INTO saved_recipes VALUES('${id}', '${id_user}',
        '${id_recipe}', '${created_at}')`);
}

const deleteSavedRecipe = (id_recipe, id_user) => {
    return pool.query(`DELETE FROM saved_recipes WHERE id_recipe='${id_recipe}' 
        AND id_user='${id_user}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT id FROM saved_recipes WHERE id='${id}'`,
            (error, result) => !error ? resolve(result) : reject(error)));
}

const findUserSavedRecipe = (id_recipe, id_user) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT id_user FROM saved_recipes WHERE id_recipe='${id_recipe}' 
            AND id_user='${id_user}'`, (error, result) => 
                !error ? resolve(result) : reject(error)));
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(*) from saved_recipes'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectSavedRecipe,
    selectDetailSavedRecipe,
    insertSavedRecipe,
    deleteSavedRecipe,
    findId,
    findUserSavedRecipe,
    countData
}