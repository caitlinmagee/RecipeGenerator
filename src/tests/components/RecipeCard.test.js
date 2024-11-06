import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeCard from '../../components/RecipeCard';
import { fetchRecipe } from '../../api/service/recipeService';

jest.mock('../../api/service/recipeService', () => ({
    fetchRecipe: jest.fn(),
}));

const recipe = {
    idMeal: '12345',
    strMeal: 'Tomato Soup',
    strMealThumb: 'https://www.example.com/tomato-soup.jpg',
};

describe('RecipeCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the RecipeCard with correct image and opens modal on click', async () => {
        render(<RecipeCard recipe={recipe} />);

        expect(screen.getByTestId('recipe-card')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-card-image')).toHaveAttribute('src', recipe.strMealThumb);

        fireEvent.click(screen.getByTestId('recipe-card'));

        await waitFor(() => screen.getByTestId('recipe-modal'));

        expect(screen.getByTestId('recipe-modal')).toBeVisible();
    });

    test('displays a loading message while fetching recipe details', async () => {
        fetchRecipe.mockResolvedValueOnce({
            json: () => ({
                meals: [{ strMealThumb: 'https://www.example.com/image.jpg', strMeal: 'Tomato Soup' }],
            }),
        });

        render(<RecipeCard recipe={recipe} />);
        fireEvent.click(screen.getByTestId('recipe-card'));

        expect(screen.getByTestId('loading-message')).toBeInTheDocument();
    });

    test('displays recipe details in the modal once fetched', async () => {
        fetchRecipe.mockResolvedValueOnce({
            json: () => ({
                meals: [
                    {
                        strMeal: 'Tomato Soup',
                        strMealThumb: 'https://www.example.com/tomato-soup.jpg',
                        strInstructions: 'Boil water.\nAdd tomato.\nServe hot.',
                        strIngredient1: 'Tomato',
                        strIngredient2: 'Water',
                        strSource: 'https://www.example.com/full-recipe',
                    },
                ],
            }),
        });

        render(<RecipeCard recipe={recipe} />);
        fireEvent.click(screen.getByTestId('recipe-card'));

        await waitFor(() => expect(screen.queryByTestId('loading-message')).toBeNull());

        expect(screen.getByTestId('recipe-modal')).toBeVisible();
        expect(screen.getByTestId('modal-recipe-image')).toHaveAttribute('src', 'https://www.example.com/tomato-soup.jpg');
        expect(screen.getByTestId('ingredients-title')).toHaveTextContent('Ingredients');
        expect(screen.getByTestId('instructions-title')).toHaveTextContent('Instructions');
        expect(screen.getByTestId('view-full-recipe-button')).toHaveAttribute('href', 'https://www.example.com/full-recipe');
    });

    test('shows a no details message when no recipe details are found', async () => {
        fetchRecipe.mockResolvedValueOnce({
            json: () => ({ meals: [] }),
        });

        render(<RecipeCard recipe={recipe} />);
        fireEvent.click(screen.getByTestId('recipe-card'));

        await waitFor(() => expect(screen.queryByTestId('loading-message')).toBeNull());

        expect(screen.getByTestId('no-details-message')).toBeInTheDocument();
    });
});
