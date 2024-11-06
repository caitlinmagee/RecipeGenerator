import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Input, Button, Pagination, Typography } from 'antd';
import { fetchIngredients, fetchRecipes } from '../api/service/recipeService';
import IngredientCard from '../components/IngredientCard';
import RecipeCard from '../components/RecipeCard';
import SelectedIngredients from '../components/SelectedIngredients';
import '../../src/styles/App.css';

const { Header, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const itemsPerPage = 12;

const Home = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [noRecipesGenerated, setNoRecipesGenerated] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");

    const handlePageChange = (page) => setCurrentPage(page);

    const handleCheckboxChange = (ingredientName) => {
        setSelectedIngredients((prevSelected) =>
            prevSelected.includes(ingredientName)
                ? prevSelected.filter(name => name !== ingredientName)
                : [...prevSelected, ingredientName]
        );
        setSearchTerm("");
        setFilteredIngredients(ingredients);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        const filtered = ingredients.filter((ingredient) =>
            ingredient.strIngredient.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredIngredients(filtered);
        setCurrentPage(1);
    };

    const removeSelectedIngredient = (ingredientName) =>
        setSelectedIngredients(prevSelected => prevSelected.filter(name => name !== ingredientName));

    const loadIngredients = async () => {
        try {
            const data = await fetchIngredients();
            if (data && data.meals) {
                setIngredients(data.meals);
                setFilteredIngredients(data.meals);
            } else {
                setError('No ingredients found.');
            }
        } catch (error) {
            setError('Error fetching ingredients: ' + error.message);
        }
    };

    const searchForRecipes = async () => {
        setError(null)

        if (selectedIngredients.length === 0) return;

        try {
            const firstIngredient = selectedIngredients[0];
            const response = await fetchRecipes(firstIngredient);
            const data = await response.json();

            if (!data.meals) {
                setNoRecipesGenerated(true);
                setRecipes([]);
                return;
            }

            const filteredRecipes = [];
            for (const recipe of data.meals) {
                const ingredients = await getRecipeIngredients(recipe.idMeal);
                const allIngredientsMatch = ingredients.every(ingredient =>
                    selectedIngredients.map(item => item.toLowerCase().trim()).includes(ingredient.toLowerCase().trim())
                );

                if (allIngredientsMatch) filteredRecipes.push(recipe);
            }

            setNoRecipesGenerated(filteredRecipes.length === 0);
            setRecipes(filteredRecipes);
        } catch (error) {
            setError('Error fetching recipes: ' + error.message);
        }
    };

    const getRecipeIngredients = async (mealId) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            if (data.meals && data.meals.length > 0) {
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    const ingredient = data.meals[0][`strIngredient${i}`];
                    if (ingredient) ingredients.push(ingredient);
                }
                return ingredients;
            }
            setError('No ingredients found for the meal');
            return [];
        } catch (error) {
            setError('Error fetching recipe ingredients: ' + error.message);
            return [];
        }
    };

    const handleClearRecipe = () => {
        setRecipes([]);
        setNoRecipesGenerated(false);
    };

    useEffect(() => {
        loadIngredients();
    }, []);

    const dataToPaginate = recipes.length > 0 ? recipes : filteredIngredients;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataToPaginate.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Layout>
            <Header className="app-header">
                <h1 className="header-title" data-testid="header-title">Recipe Generator</h1>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Row justify="center" style={{ marginBottom: '10px' }}>
                    <Col xs={24} sm={16} md={12}>
                      <Search
                        placeholder="Search for an ingredient"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        style={{ borderRadius: '8px' }}
                        disabled={recipes.length > 0}
                        data-testid="search-input" />
                    </Col>
                </Row>

                <Row justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={16} md={8}>
                        <Button
                        type="primary"
                        onClick={searchForRecipes}
                        disabled={selectedIngredients.length === 0}
                        style={{ width: '100%' }}
                        data-testid="generate-recipe-button"
                        >
                            Generate a Recipe
                        </Button>
                    </Col>
                </Row>

                {noRecipesGenerated && !recipes.length && (
                    <Row justify="center" style={{ padding: '20px' }}>
                        <Text type="danger" data-testid="no-recipes-text">
                            There are no recipes with the selected ingredients. Add more ingredients to see more options.
                        </Text>
                    </Row>
                )}

                {selectedIngredients.length > 0 && (
                    <SelectedIngredients
                        selectedIngredients={selectedIngredients}
                        onRemove={removeSelectedIngredient}
                    />
                )}

                {error && (
                    <Row justify="center" style={{ marginBottom: '20px' }}>
                        <Text type="danger" data-testid="error-message">{error}</Text>
                    </Row>
                )}

              <Row justify="center" style={{ marginTop: '20px' }}>
                  {recipes.length > 0 && (
                      <Col xs={24} sm={16} md={8}>
                          <Button onClick={handleClearRecipe} style={{ width: '60%' }} data-testid="clear-recipes-button">
                              Clear Recipes
                          </Button>
                      </Col>
                  )}
              </Row>
                <Row justify="center" style={{ padding: '20px' }}>
                    <Col xs={24} md={20} lg={16}>
                        <Card
                            title={recipes.length > 0 ? "Recipes" : "Ingredients"}
                            bordered={true}
                            style={{ backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                            data-testid="main-card"
                        >
                            <Row gutter={[16, 16]} justify="center">
                                {recipes.length > 0
                                    ? currentItems.map((recipe) => (
                                        <RecipeCard key={recipe.idMeal} recipe={recipe} data-testid="recipe-card" />
                                    ))
                                    : currentItems.map((ingredient) => (
                                        <IngredientCard
                                            key={ingredient.idIngredient}
                                            ingredient={ingredient}
                                            onCheckboxChange={handleCheckboxChange}
                                            isChecked={selectedIngredients.includes(ingredient.strIngredient)}
                                            data-testid="ingredient-card"
                                        />
                                    ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Row justify="center" style={{ marginTop: '20px' }}>
                    <Pagination
                        current={currentPage}
                        total={dataToPaginate.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        pageSize={itemsPerPage}
                        data-testid="pagination"
                    />
                </Row>
            </Content>
        </Layout>
    );
};

export default Home;
