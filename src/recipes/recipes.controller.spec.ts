import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { NotFoundException } from '@nestjs/common';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            searchByIngredient: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new recipe', () => {
      const createRecipeDto: CreateRecipeDto = { name: 'New Recipe', ingredients: ['ingredient1', 'ingredient2'], instructions: 'Test instructions' };
      const createdRecipe = { id: 'test-id', ...createRecipeDto };
      jest.spyOn(service, 'create').mockReturnValue(createdRecipe);

      expect(controller.create(createRecipeDto)).toBe(createdRecipe);
      expect(service.create).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of recipes', () => {
      const result = [{ id: 'test-id', name: 'Test Recipe', ingredients: ['ingredient1'], instructions: 'Test instructions' }];
      jest.spyOn(service, 'findAll').mockReturnValue(result);

      expect(controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search recipes by ingredient', () => {
      const ingredient = 'test-ingredient';
      const result = [{ id: 'test-id', name: 'Test Recipe', ingredients: [ingredient], instructions: 'Test instructions' }];
      jest.spyOn(service, 'searchByIngredient').mockReturnValue(result);

      expect(controller.search(ingredient)).toBe(result);
      expect(service.searchByIngredient).toHaveBeenCalledWith(ingredient);
    });
  });

  describe('findOne', () => {
    it('should return a recipe by id', () => {
      const id = 'test-id';
      const result = { id, name: 'Test Recipe', ingredients: ['ingredient1'], instructions: 'Test instructions' };
      jest.spyOn(service, 'findOne').mockReturnValue(result);

      expect(controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when recipe is not found', () => {
      const id = 'non-existent-id';
      jest.spyOn(service, 'findOne').mockReturnValue(undefined);

      expect(() => controller.findOne(id)).toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a recipe', () => {
      const id = 'test-id';
      const updateRecipeDto: UpdateRecipeDto = { name: 'Updated Recipe' };
      const updatedRecipe = { id, name: 'Updated Recipe', ingredients: ['ingredient1'], instructions: 'Test instructions' };
      jest.spyOn(service, 'update').mockReturnValue(updatedRecipe);

      expect(controller.update(id, updateRecipeDto)).toBe(updatedRecipe);
      expect(service.update).toHaveBeenCalledWith(id, updateRecipeDto);
    });

    it('should throw NotFoundException when recipe to update is not found', () => {
      const id = 'non-existent-id';
      const updateRecipeDto: UpdateRecipeDto = { name: 'Updated Recipe' };
      jest.spyOn(service, 'update').mockReturnValue(undefined);

      expect(() => controller.update(id, updateRecipeDto)).toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(id, updateRecipeDto);
    });
  });

  describe('remove', () => {
    it('should remove a recipe', () => {
      const id = 'test-id';
      jest.spyOn(service, 'remove').mockReturnValue(true);

      controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when recipe to remove is not found', () => {
      const id = 'non-existent-id';
      jest.spyOn(service, 'remove').mockReturnValue(false);

      expect(() => controller.remove(id)).toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});