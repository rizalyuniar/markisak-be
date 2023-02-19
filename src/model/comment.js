const pool = require('../config/db');

const selectRecipeComments = (id_recipe, sortBy = 'updated_at', sort = 'desc', limit = '100', offset = '0') => {
    return pool.query(`SELECT comments.id, users.id, users.name AS name, 
        users.photo AS photo, comments.message, comments.created_at, 
        comments.updated_at FROM comments INNER JOIN users 
        ON comments.id_user = users.id WHERE id_recipe='${id_recipe}' 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectComment = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT comments.id, users.name AS name, 
            users.photo AS photo, comments.message, comments.created_at 
            FROM comments INNER JOIN users ON comments.id_user = users.id 
            WHERE comments.id='${id}'`, (error, result) =>
            !error ? resolve(result) : reject(error)));
}

const insertComment = (data) => {
    const { id, id_user, id_recipe, message, created_at, updated_at } = data;
    return pool.query(`INSERT INTO comments VALUES('${id}', '${id_user}', 
        '${id_recipe}', '${message}', '${created_at}', '${updated_at}')`);
}

const updateComment = (data) => {
    const { id, message, updated_at } = data;
    return pool.query(`UPDATE comments SET message='${message}', 
        updated_at=${updated_at} WHERE id='${id}'`);
}

const deleteComment = (id) => {
    return pool.query(`DELETE FROM comments WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(*) from comments`,
            (error, result) => !error ? resolve(result) : reject(error)));
}

module.exports = {
    selectRecipeComments,
    selectComment,
    insertComment,
    updateComment,
    deleteComment,
    countData
}