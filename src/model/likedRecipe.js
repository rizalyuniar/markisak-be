const pool = require('../config/db');

const selectLikedRecipe = (id_recipe) => {
    return pool.query(`select * from liked_recipes where id_recipe='${id_recipe}'`);
}

const selectDetailLikedRecipe = (id_recipe, id_liked_recipe) => {
    return pool.query(`select * from liked_recipes where id_recipe='${id_recipe}' and id='${id_liked_recipe}'`);
}

const insertLikedRecipe = (data) => {
    const { id, id_user, id_recipe, created_at } = data;
    return pool.query(`insert into liked_recipes values('${id}', '${id_user}',
        '${id_recipe}', '${created_at}')`);
}

const deleteLikedRecipe = (id_recipe, id_user) => {
    return pool.query(`delete from liked_recipes where id_recipe='${id_recipe}' and id_user='${id_user}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from liked_recipes where id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

const findUserLikedRecipe = (id_recipe, id_user) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id_user from liked_recipes where id_recipe='${id_recipe}' and id_user='${id_user}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

module.exports = {
    selectLikedRecipe,
    selectDetailLikedRecipe,
    insertLikedRecipe,
    deleteLikedRecipe,
    findId,
    findUserLikedRecipe
}