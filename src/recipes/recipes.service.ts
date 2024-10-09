import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  create(createRecipeDto: CreateRecipeDto) {
    const recipe = new Recipe();
    recipe.id = Date.now().toString();
    recipe.name = createRecipeDto.name;
    recipe.ingredients = createRecipeDto.ingredients;
    recipe.instructions = createRecipeDto.instructions;
    this.recipes.push(recipe);
    return recipe;
  }

  findAll() {
    return this.recipes;
  }

  findOne(id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipe = this.findOne(id);
    if (recipe) {
      Object.assign(recipe, updateRecipeDto);
    }
    return recipe;
  }

  remove(id: string) {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      return this.recipes.splice(index, 1)[0];
    }
    return null;
  }

  searchByIngredient(ingredient: string) {
    return this.recipes.filter(recipe =>
      recipe.ingredients.some(i => i.toLowerCase().includes(ingredient.toLowerCase()))
    );
  }
}