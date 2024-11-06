export const fetchIngredients = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        if (!response.ok) {
            throw new Error(`Failed to fetch ingredients: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const fetchRecipes = async (ingredient) => {
    try {
        const response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipes for ingredient "${ingredient}": ${response.status}`);
        }
        return await response;
    } catch (error) {
        throw error;
    }
};

export const fetchRecipe = async (mealId) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipe with meal ID "${mealId}": ${response.status}`);
        }
        return await response;
    } catch (error) {
        throw error;
    }
};
