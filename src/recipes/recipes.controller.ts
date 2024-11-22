import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe, UsePipes, NotFoundException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Recipe } from './entities/recipe.entity';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({ status: 201, description: 'The recipe has been successfully created.', type: Recipe })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createRecipeDto: CreateRecipeDto): Recipe {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ status: 200, description: 'Return all recipes.', type: [Recipe] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10): Recipe[] {
    return this.recipesService.findAll(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search recipes by ingredient' })
  @ApiResponse({ status: 200, description: 'Return recipes containing the specified ingredient.', type: [Recipe] })
  @ApiQuery({ name: 'ingredient', required: true, type: String })
  search(@Query('ingredient') ingredient: string): Recipe[] {
    return this.recipesService.searchByIngredient(ingredient);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by id' })
  @ApiResponse({ status: 200, description: 'Return the recipe.', type: Recipe })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Recipe {
    const recipe = this.recipesService.findOne(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }
    return recipe;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({ status: 200, description: 'The recipe has been successfully updated.', type: Recipe })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiParam({ name: 'id', type: String })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Recipe {
    const updatedRecipe = this.recipesService.update(id, updateRecipeDto);
    if (!updatedRecipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }
    return updatedRecipe;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiResponse({ status: 200, description: 'The recipe has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): void {
    const deleted = this.recipesService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }
  }
}
