import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../components/Home.js';
import { fetchIngredients, fetchRecipes } from '../../api/service/recipeService.js';

jest.mock('../../api/service/recipeService.js', () => ({
  fetchIngredients: jest.fn(),
  fetchRecipes: jest.fn(),
}));

describe('Home component', () => {
  beforeEach(() => {
    fetchIngredients.mockClear();
    fetchRecipes.mockClear();
  });


test('renders main elements and loads ingredients on mount', async () => {
  fetchIngredients.mockResolvedValueOnce({
    meals: [{ strIngredient: 'Chicken', idIngredient: '1' }],
  });

  render(<Home />);

  expect(screen.getByTestId('header-title')).toHaveTextContent('Recipe Generator');
  expect(screen.getByTestId('search-input')).toBeInTheDocument();
  expect(screen.getByTestId('generate-recipe-button')).toBeDisabled();
  expect(screen.getByTestId('pagination')).toBeInTheDocument();

  await waitFor(() => expect(fetchIngredients).toHaveBeenCalledTimes(1));

  await waitFor(() => screen.getByText(/chicken/i));

  expect(screen.getByText(/chicken/i)).toBeInTheDocument();
});

  test('allows ingredient search functionality', async () => {
    fetchIngredients.mockResolvedValueOnce({
      meals: [
        { strIngredient: 'Chicken', idIngredient: '1' },
        { strIngredient: 'Beef', idIngredient: '2' },
      ],
    });

    render(<Home />);


    await waitFor(() => screen.getByText(/chicken/i));

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Beef' } });

    await waitFor(() => {
      expect(screen.queryByText(/chicken/i)).not.toBeInTheDocument();
      expect(screen.getByText(/beef/i)).toBeInTheDocument();
    });
  });
});