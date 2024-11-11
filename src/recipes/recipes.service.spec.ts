import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesService],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new recipe', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      };
      const createdRecipe = service.create(createRecipeDto);
      expect(createdRecipe).toHaveProperty('id');
      expect(createdRecipe.title).toBe(createRecipeDto.title);
      expect(createdRecipe.ingredients).toEqual(createRecipeDto.ingredients);
      expect(createdRecipe.instructions).toBe(createRecipeDto.instructions);
    });
  });

  describe('findAll', () => {
    it('should return an array of recipes', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      };
      service.create(createRecipeDto);
      const recipes = service.findAll();
      expect(recipes).toBeInstanceOf(Array);
      expect(recipes.length).toBeGreaterThan(0);
    });

    it('should return paginated results', () => {
      for (let i = 0; i < 15; i++) {
        service.create({
          title: `Test Recipe ${i}`,
          ingredients: ['ingredient1', 'ingredient2'],
          instructions: 'Test instructions',
        });
      }
      const page1 = service.findAll(1, 10);
      const page2 = service.findAll(2, 10);
      expect(page1.length).toBe(10);
      expect(page2.length).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return a recipe by id', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      };
      const createdRecipe = service.create(createRecipeDto);
      const foundRecipe = service.findOne(createdRecipe.id);
      expect(foundRecipe).toEqual(createdRecipe);
    });

    it('should return undefined for non-existent id', () => {
      const foundRecipe = service.findOne('non-existent-id');
      expect(foundRecipe).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a recipe', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      };
      const createdRecipe = service.create(createRecipeDto);
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Test Recipe',
        ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
      };
      const updatedRecipe = service.update(createdRecipe.id, updateRecipeDto);
      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.title).toBe(updateRecipeDto.title);
      expect(updatedRecipe!.ingredients).toEqual(updateRecipeDto.ingredients);
      expect(updatedRecipe!.instructions).toBe(createdRecipe.instructions);
    });

    it('should return undefined for non-existent id', () => {
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Test Recipe',
      };
      const updatedRecipe = service.update('non-existent-id', updateRecipeDto);
      expect(updatedRecipe).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a recipe', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      };
      const createdRecipe = service.create(createRecipeDto);
      const result = service.remove(createdRecipe.id);
      expect(result).toBe(true);
      const foundRecipe = service.findOne(createdRecipe.id);
      expect(foundRecipe).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      const result = service.remove('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('searchByIngredient', () => {
    it('should return recipes containing the specified ingredient', () => {
      const recipe1 = service.create({
        title: 'Recipe 1',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'Test instructions',
      });
      const recipe2 = service.create({
        title: 'Recipe 2',
        ingredients: ['ingredient2', 'ingredient3'],
        instructions: 'Test instructions',
      });
      const recipe3 = service.create({
        title: 'Recipe 3',
        ingredients: ['ingredient3', 'ingredient4'],
        instructions: 'Test instructions',
      });

      const results = service.searchByIngredient('ingredient2');
      expect(results.length).toBe(2);
      expect(results).toContainEqual(recipe1);
      expect(results).toContainEqual(recipe2);
      expect(results).not.toContainEqual(recipe3);
    });

    it('should return an empty array when no recipes match the ingredient', () => {
      const results = service.searchByIngredient('non-existent-ingredient');
      expect(results).toEqual([]);
    });
  });
});