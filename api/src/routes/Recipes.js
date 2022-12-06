const { Router } = require("express");
const axios = require("axios");
const { API_KEY } = process.env;
const { Recipe, Diet } = require("../db")


////////////// CONTROLLERS ///////////

//////// FUNCION PARA TRAER LAS RECETAS DE LA API ////////
const getApiInfo = async () => {
        const apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
        const apiData = await apiUrl.data.map((e) => {
        return {
            id: e.id,
            name: e.name,
            summary: e.summary,
            healthScore: e.healthScore,
            steps: e.steps,
            image: e.image
        }
    })
    return apiData; 
};

/////// FUNCION PARA TRAER LAS RECETAS DE LA DB ///////
const getDbInfo = async () => {
    const dbRecipes = await Recipe.findAll({
        include: {
            model: Diet,
            attributes: ["name"],
            through: {
                attributes: [],
            },
        },
    });
};

/////// CONCATENO AMBAS INFOS(API Y DB) ////////
const getAllRecipes = async () => {
    const apiData = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiData.concat(dbInfo);
    return infoTotal;
}
