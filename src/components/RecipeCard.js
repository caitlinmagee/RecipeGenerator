import React, { useState } from 'react';
import { Card, Modal, Button, List, Typography } from 'antd';
import { fetchRecipe } from '../api/service/recipeService';
import '../styles/Styles.css';

const RecipeCard = ({ recipe }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const showModal = async () => {
        setIsModalVisible(true);
        setLoading(true);
        setRecipeDetails(null);

        try {
            const response = await fetchRecipe(recipe.idMeal);
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                setRecipeDetails(data.meals[0]);
            } else {
                setRecipeDetails(null);
            }
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            setRecipeDetails(null);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setRecipeDetails(null);
    };

    const splitInstructions = (instructions) => {
        return instructions.split('\n')
            .filter(line => {
                const trimmedLine = line.trim();
                return trimmedLine.length > 1 && !/^\d+$/.test(trimmedLine);
            });
    };

    return (
        <>
            <Card
                data-testid="recipe-card"
                title={<span className="card-title">{recipe.strMeal}</span>}
                bordered={false}
                hoverable
                className="card-container"
                bodyStyle={{ padding: '15px' }}
                onClick={showModal}
            >
                <img
                    data-testid="recipe-card-image"
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="card-image"
                />
            </Card>

            <Modal
                data-testid="recipe-modal"
                title={recipe.strMeal}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" data-testid="modal-close-button" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
                width={600}
            >
                {loading ? (
                    <div data-testid="loading-message">Loading...</div>
                ) : recipeDetails ? (
                    <>
                        <img
                            data-testid="modal-recipe-image"
                            src={recipeDetails.strMealThumb}
                            alt={recipeDetails.strMeal}
                        />
                        <Typography.Title level={4} data-testid="ingredients-title">
                            Ingredients
                        </Typography.Title>
                        <List
                            bordered
                            dataSource={Object.keys(recipeDetails)
                                .filter(key => key.includes('strIngredient') && recipeDetails[key])
                                .map(key => recipeDetails[key])}
                            renderItem={ingredient => (
                                <List.Item data-testid="ingredient-item">{ingredient}</List.Item>
                            )}
                            data-testid="ingredients-list"
                        />

                        <Typography.Title level={4} data-testid="instructions-title">
                            Instructions
                        </Typography.Title>
                        <List
                            bordered
                            dataSource={splitInstructions(recipeDetails.strInstructions)}
                            renderItem={(instruction, index) => (
                                <List.Item data-testid="instruction-item">
                                    <strong>{index + 1}.</strong> {instruction}
                                </List.Item>
                            )}
                            data-testid="instructions-list"
                        />

                        {recipeDetails.strSource && (
                            <Button
                                type="primary"
                                href={recipeDetails.strSource}
                                target="_blank"
                                data-testid="view-full-recipe-button"
                            >
                                View Full Recipe
                            </Button>
                        )}
                    </>
                ) : (
                    <div data-testid="no-details-message">No details found for this recipe.</div>
                )}
            </Modal>
        </>
    );
};

export default RecipeCard;
