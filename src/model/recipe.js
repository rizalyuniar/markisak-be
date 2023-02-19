const pool = require('../config/db');

const selectAllRecipes = (searchParam, sortBy, sort, limit, offset) => {
    return pool.query(`SELECT recipes.*, COUNT(liked_recipes.id_recipe) 
        AS "like_count" FROM liked_recipes 
        RIGHT JOIN recipes ON liked_recipes.id_recipe = recipes.id 
        WHERE title ILIKE '%${searchParam}%' GROUP BY recipes.id 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectRecipe = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select * from recipes where id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertRecipe = (data) => {
    const { id, id_user, title, photo, ingredients, created_at, updated_at,
        description } = data;
    return pool.query(`INSERT INTO recipes VALUES('${id}', '${id_user}', 
        '${title}', '${photo}', '${ingredients}', '${created_at}', 
        '${updated_at}', '${description}')`);
}

const updateRecipe = (data) => {
    const { id, title, photo, ingredients, updated_at, description } = data;
    return pool.query(`UPDATE recipes SET title='${title}', 
        ingredients='${ingredients}', photo='${photo}', updated_at='${updated_at}', 
        description='${description}', WHERE id='${id}'`);
}

const deleteRecipe = (id) => {
    return pool.query(`DELETE FROM recipes WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(*) from recipes`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectAllRecipes,
    selectRecipe,
    insertRecipe,
    updateRecipe,
    deleteRecipe,
    countData
}