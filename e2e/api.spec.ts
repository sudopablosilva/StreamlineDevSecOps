
import { test, expect } from '@playwright/test';

test.describe('Recipes API', () => {
  let recipeId: string;
  test.beforeAll(async ({ request }) => {
    // Create a recipe for testing
    const newRecipe = {
      title: 'Test Recipe',
      ingredients: ['ingredient 1', 'ingredient 2'],
      instructions: ['Test instructions'],
    };

    const response = await request.post('/api/recipes', {
      data: newRecipe
    });
    expect(response.ok()).toBeTruthy();
    
    const createdRecipe = await response.json();
    expect(createdRecipe).toHaveProperty('title', newRecipe.title);
    recipeId = createdRecipe.id;
  });

  test.afterAll(async ({ request }) => {
    // Delete the recipe after testing
    const response = await request.delete(`/api/recipes/${recipeId}`);
    expect(response.ok()).toBeTruthy();
  });

  test('GET /recipes - should return all recipes', async ({ request }) => {
    const response = await request.get('/api/recipes');
    expect(response.ok()).toBeTruthy();
    
    const recipes = await response.json();
    expect(Array.isArray(recipes)).toBeTruthy();
  });

  test('GET /recipes/:id - should return recipe by id', async ({ request }) => {
    const response = await request.get(`/api/recipes/${recipeId}`);
    expect(response.ok()).toBeTruthy();
    
    const recipe = await response.json();
    expect(recipe).toHaveProperty('id', recipeId);
  });

  test('PUT /recipes/:id - should update recipe', async ({ request }) => {
    const updatedData = {
      title: 'Updated Recipe',
      ingredients: ['new ingredient'],
      instructions: ['Updated instructions'],
    };

    const response = await request.put(`/api/recipes/${recipeId}`, {
      data: updatedData
    });
    expect(response.ok()).toBeTruthy();
    
    const updatedRecipe = await response.json();
    expect(updatedRecipe).toHaveProperty('title', updatedData.title);
  });
});

