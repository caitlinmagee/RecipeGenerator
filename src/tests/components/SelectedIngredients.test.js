import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectedIngredients from '../../components/SelectedIngredients';

describe('SelectedIngredients Component', () => {
  let selectedIngredients;
  let onRemove;

  beforeEach(() => {
    selectedIngredients = ['Tomato', 'Onion', 'Garlic'];
    onRemove = jest.fn();
  });

  test('renders the selected ingredients correctly', () => {
    render(<SelectedIngredients selectedIngredients={selectedIngredients} onRemove={onRemove} />);

    selectedIngredients.forEach(ingredient => {
      expect(screen.getByTestId(`ingredient-tag-${ingredient}`)).toHaveTextContent(ingredient);
    });
  });

  test('calls onRemove function when the checkbox is clicked', () => {
    render(<SelectedIngredients selectedIngredients={selectedIngredients} onRemove={onRemove} />);

    const tomatoTag = screen.getByTestId('ingredient-tag-Tomato');

    fireEvent.click(tomatoTag.querySelector('span.ant-tag-close-icon'));

    expect(onRemove).toHaveBeenCalledWith('Tomato');
  });

  test('renders the Card component with the correct title', () => {
    render(<SelectedIngredients selectedIngredients={selectedIngredients} onRemove={onRemove} />);

    expect(screen.getByTestId('ingredients-card-title')).toHaveTextContent('Selected Ingredients');
  });

  test('renders a message when no ingredients are selected', () => {
    render(<SelectedIngredients selectedIngredients={[]} onRemove={onRemove} />);

    expect(screen.getByTestId('no-ingredients-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-ingredients-message')).toHaveTextContent('No ingredients selected');
  });
});
