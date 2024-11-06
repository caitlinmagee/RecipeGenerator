import React from 'react';
import { Card, Tag, Row, Col } from 'antd';
import '../styles/Styles.css';

const SelectedIngredients = ({ selectedIngredients, onRemove }) => {
  return (
    <Row justify="center" style={{ padding: '20px' }}>
      <Col xs={24} sm={24} md={20} lg={16}>
        <Card
          title={<span className="card-title" data-testid="ingredients-card-title">Selected Ingredients</span>}
          bordered={false}
          className="ingredients-selected"
          bodyStyle={{ padding: '15px' }}
        >
          {selectedIngredients.length === 0 ? (
            <p data-testid="no-ingredients-message">No ingredients selected</p>
          ) : (
            selectedIngredients.map((ingredientName) => (
              <Tag
                key={ingredientName}
                closable
                onClose={() => onRemove(ingredientName)}
                className="ingredient-tag"
                data-testid={`ingredient-tag-${ingredientName}`}
              >
                {ingredientName}
              </Tag>
            ))
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default SelectedIngredients;
