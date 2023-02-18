const pool = require('../config/db');

const selectAllRecipes = (searchParam, sortBy, sort, limit, offset) => {
    return pool.query(`select recipes.*, count(liked_recipes.id_recipe) 
        as "like_count" from liked_recipes 
        right join recipes on liked_recipes.id_recipe = recipes.id 
        where title ilike '%${searchParam}%' group by recipes.id 
        order by ${sortBy} ${sort} limit ${limit} offset ${offset}`);
}

const selectRecipe = (id) => {
    return pool.query(`select * from recipes where id='${id}'`);
}

const insertRecipe = (data) => {
    const { id, id_user, title, photo, ingredients, created_at, updated_at, 
        description } = data;
    return pool.query(`insert into recipes values('${id}', '${id_user}', 
        '${title}', '${photo}', '${ingredients}', '${created_at}', 
        '${updated_at}', '${description}')`);
}

const updateRecipe = (data) => {
    const { id, title, photo, ingredients, updated_at, description } = data;
    return pool.query(`update recipes set title='${title}', photo='${photo}', 
        ingredients='${ingredients}', updated_at='${updated_at}', 
        description='${description}' where id='${id}'`);
}

const deleteRecipe = (id) => {
    return pool.query(`delete from recipes where id='${id}'`);
}

const countData = () => {
    return pool.query(`select count(*) from recipes`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from recipes where id='${id}'`, 
        (error, result) => {
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