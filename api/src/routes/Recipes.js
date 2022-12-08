const { Router } = require("express");
const axios = require("axios");
const { API_KEY } = process.env;
const { Recipe, Diet } = require("../db")
const router = Router();


////////////// CONTROLLERS ///////////

//////// FUNCION PARA TRAER LAS RECETAS DE LA API ////////
const getApiInfo = async () => {
        const apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
        const apiData = await apiUrl.data.map((e) => {
        return {
            id: e.id,
            name: e.title,
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


///////// ROUTER PARA TRAER POR NAME(query) ////////
router.get("/", async (req, res) => {
    const name =  req.query.name
    try {
        const totalRecipes = await getAllRecipes();
        
        // Si hay nombre pasarlo a minuscula //
        if(name) {
            const recipeName = await totalRecipes.filter((e) => 
            e.name.toLowerCase().include(name.toLowerCase())
            )
            recipeName.length
            ? res.status(200).json(recipeName)
            : res.status(404).send("La receta no existe")    
        // Si no hay mostrar todas las recetas //
        } else { 
            res.status(202).json(totalRecipes)
        }
    } catch(error) {
        res.status(404).send("No funciona")
    }
})
    
    

module.exports = router;