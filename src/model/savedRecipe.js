const pool = require('../config/db');

const selectSavedRecipe = (id_recipe) => {
    return pool.query(`select * from saved_recipes where id_recipe='${id_recipe}'`);
}

const selectDetailSavedRecipe = (id_recipe, id_saved_recipe) => {
    return pool.query(`select * from saved_recipes where id_recipe='${id_recipe}' and id='${id_saved_recipe}'`);
}

const insertSavedRecipe = (data) => {
    const { id, id_user, id_recipe, created_at } = data;
    return pool.query(`insert into saved_recipes values('${id}', '${id_user}',
        '${id_recipe}', '${created_at}')`);
}

const deleteSavedRecipe = (id_recipe, id_user) => {
    return pool.query(`delete from saved_recipes where id_recipe='${id_recipe}' and id_user='${id_user}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from saved_recipes where id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

const findUserSavedRecipe = (id_recipe, id_user) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id_user from saved_recipes where id_recipe='${id_recipe}' and id_user='${id_user}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

module.exports = {
    selectSavedRecipe,
    selectDetailSavedRecipe,
    insertSavedRecipe,
    deleteSavedRecipe,
    findId,
    findUserSavedRecipe
}