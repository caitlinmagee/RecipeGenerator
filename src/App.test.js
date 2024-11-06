import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders the Home component inside App', () => {
    render(<App />);

    expect(screen.getByTestId('header-title')).toBeInTheDocument();
    expect(screen.getByText("Recipe Generator")).toBeInTheDocument();
  });
});
