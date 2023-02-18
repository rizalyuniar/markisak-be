const pool = require('../config/db');

const selectRecipeComments = (id_recipe, sortBy, sort, limit, offset) => {
    return pool.query(`SELECT comments.id, users.id, users.name AS name, 
        users.photo AS photo, comments.message, comments.created_at, 
        comments.updated_at FROM comments INNER JOIN users 
        ON comments.id_user = users.id WHERE id_recipe='${id_recipe}' 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectComment = (id_recipe, id_comment) => {
    return pool.query(`SELECT comments.id, users.name AS name, 
        users.photo AS photo, comments.message, comments.created_at 
        FROM comments INNER JOIN users ON comments.id_user = users.id 
        WHERE id_recipe='${id_recipe}' AND comments.id='${id_comment}'`);
}

const insertComment = (data) => {
    const { id, id_user, id_recipe, message, created_at, updated_at } = data;
    return pool.query(`INSERT INTO comments VALUES('${id}', '${id_user}', 
        '${id_recipe}', '${message}', '${created_at}', '${updated_at}')`);
}

const updateComment = (data) => {
    const { id, id_user, id_recipe, message, updated_at } = data;
    return pool.query(`UPDATE comments SET message='${message}', 
        updated_at=${updated_at} WHERE id='${id}' AND id_user='${id_user}' 
        AND id_recipe='${id_recipe}'`);
}

const deleteComment = (id, id_user, id_recipe) => {
    return pool.query(`DELETE FROM comments WHERE id='${id}'
        AND id_user='${id_user}' AND id_recipe='${id_recipe}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT id, id_user FROM comments WHERE id='${id}'`,
            (error, result) => !error ? resolve(result) : reject(error)));
}

module.exports = {
    selectRecipeComments,
    selectComment,
    insertComment,
    updateComment,
    deleteComment,
    findId
}