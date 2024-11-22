import { Injectable } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

let idCounter = 0

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  create(createRecipeDto: CreateRecipeDto): Recipe {
    const newRecipe = {
      id: (idCounter++).toString(),
      ...createRecipeDto,
    };
    this.recipes.push(newRecipe);
    return newRecipe;
  }

  findAll(page: number = 1, limit: number = 10): Recipe[] {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return this.recipes.slice(startIndex, endIndex);
  }

  findOne(id: string): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }

  update(id: string, updateRecipeDto: UpdateRecipeDto): Recipe | undefined {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      this.recipes[index] = { ...this.recipes[index], ...updateRecipeDto };
      return this.recipes[index];
    }
    return undefined;
  }

  remove(id: string): boolean {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      this.recipes.splice(index, 1);
      return true;
    }
    return false;
  }

  searchByIngredient(ingredient: string): Recipe[] {
    return this.recipes.filter(recipe => 
      recipe.ingredients?.some(i => i.toLowerCase().includes(ingredient.toLowerCase()))
    );
  }
}
