import { fetchIngredients, fetchRecipes, fetchRecipe } from '../../api/service/recipeService.js';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('API Service Tests', () => {

  test('fetchIngredients should return data when the fetch is successful', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ meals: [{ strIngredient: 'Chicken' }, { strIngredient: 'Beef' }] })
    });

    const data = await fetchIngredients();

    expect(data).toEqual({ meals: [{ strIngredient: 'Chicken' }, { strIngredient: 'Beef' }] });
    expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  });

  test('fetchIngredients should throw an error when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch ingredients'));

    await expect(fetchIngredients()).rejects.toThrow('Failed to fetch ingredients');
  });

  test('fetchRecipes should return data when the fetch is successful', async () => {
    const ingredient = 'Chicken';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ meals: [{ idMeal: '1', strMeal: 'Chicken Soup' }] })
    });

    const data = await fetchRecipes(ingredient);

    expect(data.ok).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `https://themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
  });

  test('fetchRecipes should throw an error when the fetch fails', async () => {
    const ingredient = 'Chicken';

    fetch.mockRejectedValueOnce(new Error(`Failed to fetch recipes for ingredient "Chicken"`));

    await expect(fetchRecipes(ingredient)).rejects.toThrow('Failed to fetch recipes for ingredient "Chicken"');
  });

  test('fetchRecipe should return data when the fetch is successful', async () => {
    const mealId = '52772';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Chicken Curry',
            strMealThumb: 'https://example.com/chicken-curry.jpg',
          },
        ],
      })
    });

    const data = await fetchRecipe(mealId);

    expect(data.ok).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
  });

  test('fetchRecipe should throw an error when the fetch fails', async () => {
    const mealId = '52772';

    fetch.mockRejectedValueOnce(new Error(`Failed to fetch recipe with meal ID "52772"`));

    await expect(fetchRecipe(mealId)).rejects.toThrow('Failed to fetch recipe with meal ID "52772"');
  });

});
