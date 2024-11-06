import React from 'react';
import { Card, Checkbox, Row, Col, Tooltip } from 'antd';
import '../styles/Styles.css';

const IngredientCard = ({ ingredient, onCheckboxChange, isChecked }) => {
    return (
        <Col xs={12} sm={12} md={8} lg={6} data-testid="ingredient-card">
            <Card
                title={
                    <Row justify="space-between" align="middle" className="ingredient-card-header" data-testid="ingredient-card-header">
                        <Col>
                            <Tooltip title={ingredient.strIngredient}>
                                <span className="ingredient-name" data-testid="ingredient-name">{ingredient.strIngredient}</span>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Checkbox
                                onChange={() => onCheckboxChange(ingredient.strIngredient)}
                                checked={isChecked}
                                data-testid="ingredient-checkbox"
                            />
                        </Col>
                    </Row>
                }
                bordered={false}
                hoverable
                className="card-container"
                data-testid="ingredient-card-container"
            >
                <img
                    src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                    alt={ingredient.strIngredient}
                    className="card-image"
                    data-testid="ingredient-image"
                />
            </Card>
        </Col>
    );
};

export default IngredientCard;
