import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IngredientCard from '../../components/IngredientCard';

const ingredient = {
  strIngredient: 'Tomato',
};

describe('IngredientCard Component', () => {
  test('displays ingredient name, image, and checkbox', () => {
    const onCheckboxChange = jest.fn();
    render(
      <IngredientCard ingredient={ingredient} onCheckboxChange={onCheckboxChange} isChecked={false} />
    );

    expect(screen.getByTestId('ingredient-name')).toHaveTextContent('Tomato');

    const img = screen.getByTestId('ingredient-image');
    expect(img).toHaveAttribute('src', 'https://www.themealdb.com/images/ingredients/Tomato.png');
    expect(img).toHaveAttribute('alt', 'Tomato');

    expect(screen.getByTestId('ingredient-checkbox')).toBeInTheDocument();
  });

  test('triggers onCheckboxChange when the checkbox is clicked', () => {
    const onCheckboxChange = jest.fn();
    render(
      <IngredientCard ingredient={ingredient} onCheckboxChange={onCheckboxChange} isChecked={false} />
    );

    const checkbox = screen.getByTestId('ingredient-checkbox');

    fireEvent.click(checkbox);

    expect(onCheckboxChange).toHaveBeenCalledWith('Tomato');
  });

  test('displays the ingredient name in a tooltip on hover', () => {
    const onCheckboxChange = jest.fn();
    render(
      <IngredientCard ingredient={ingredient} onCheckboxChange={onCheckboxChange} isChecked={false} />
    );

    const tooltip = screen.getByTestId('ingredient-name');
    expect(tooltip).toBeInTheDocument();
  });

  test('reflects the isChecked prop correctly when true', () => {
    const onCheckboxChange = jest.fn();
    render(
      <IngredientCard ingredient={ingredient} onCheckboxChange={onCheckboxChange} isChecked={true} />
    );

    expect(screen.getByTestId('ingredient-checkbox')).toBeChecked();
  });

  test('reflects the isChecked prop correctly when false', () => {
    const onCheckboxChange = jest.fn();
    render(
      <IngredientCard ingredient={ingredient} onCheckboxChange={onCheckboxChange} isChecked={false} />
    );

    expect(screen.getByTestId('ingredient-checkbox')).not.toBeChecked();
  });
});
