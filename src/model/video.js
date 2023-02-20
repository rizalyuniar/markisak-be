const pool = require('../config/db');

const selectRecipeVideos = (id_recipe) => {
    return pool.query(`SELECT * FROM videos WHERE id_recipe='${id_recipe}' 
        ORDER BY step ASC`);
}

const selectVideo = (id, id_recipe) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM videos WHERE id='${id}' AND id_recipe='${id_recipe}' ORDER BY step ASC`, 
            (error, result) => !error ? resolve(result) : reject(error)));
}

const selectRecipeVideoStep = (id_recipe, step) => {
    return pool.query(`SELECT * FROM videos WHERE id_recipe='${id_recipe}' 
        AND step=${step}`);
}

const insertVideo = (data) => {
    const { id, id_recipe, step, url_video } = data;
    return pool.query(`INSERT INTO videos VALUES('${id}', '${id_recipe}', 
        ${step}, '${url_video}')`);
}

const updateVideo = (data) => {
    const { id, step, url_video } = data;
    return pool.query(`UPDATE videos SET url_video='${url_video}', step=${step} 
        WHERE id='${id}'`);
}

const deleteVideo = (id) => {
    return pool.query(`DELETE FROM videos WHERE id='${id}'`);
}

module.exports = {
    selectRecipeVideos,
    selectVideo,
    selectRecipeVideoStep,
    insertVideo,
    updateVideo,
    deleteVideo,
}