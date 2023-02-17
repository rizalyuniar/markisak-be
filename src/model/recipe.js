const pool = require('../config/db');

const selectAllRecipes = (searchParam, sortBy, sort, limit, offset) => {
    return pool.query(`select * from recipes where title ilike '%${searchParam}%' 
        order by ${sortBy} ${sort} limit ${limit} offset ${offset}`);
}

const selectRecipe = (id) => {
    return pool.query(`select * from recipes where id='${id}'`);
}

const insertRecipe = (data) => {
    const { id, id_user, title, photo, ingredients, created_at, updated_at } = data;
    return pool.query(`insert into recipes values('${id}', '${id_user}', '${title}',
        '${photo}', '${ingredients}', '${created_at}', '${updated_at}')`);
}

const updateRecipe = (data) => {
    const { id, id_user, title, photo, ingredients, updated_at } = data;
    return pool.query(`update recipes set title='${title}', photo='${photo}', 
        ingredients='${ingredients}', updated_at='${updated_at}'
        where id='${id}'`);
}

const deleteRecipe = (id) => {
    return pool.query(`delete from recipes where id='${id}'`);
}

const countData = () => {
    return pool.query(`select count(*) from recipes`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from recipes where id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

module.exports = {
    selectAllRecipes,
    selectRecipe,
    insertRecipe,
    updateRecipe,
    deleteRecipe,
    countData,
    findId
}