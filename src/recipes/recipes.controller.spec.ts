import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { NotFoundException } from '@nestjs/common';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  const mockRecipesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    searchByIngredient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
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
    it('should create a recipe', () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2'],
      };
      const expectedResult = {
        id: '1',
        ...createRecipeDto,
      };

      jest.spyOn(service, 'create').mockReturnValue(expectedResult);

      expect(controller.create(createRecipeDto)).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of recipes', () => {
      const expectedResult = [
        { id: '1', title: 'Recipe 1', ingredients: [], instructions: [] },
        { id: '2', title: 'Recipe 2', ingredients: [], instructions: [] },
      ];

      jest.spyOn(service, 'findAll').mockReturnValue(expectedResult);

      expect(controller.findAll()).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle pagination parameters', () => {
      const page = 2;
      const limit = 5;
      
      controller.findAll(page, limit);
      
      expect(service.findAll).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('search', () => {
    it('should search recipes by ingredient', () => {
      const ingredient = 'tomato';
      const expectedResult = [
        { id: '1', title: 'Recipe with tomato', ingredients: ['tomato'], instructions: [] },
      ];

      jest.spyOn(service, 'searchByIngredient').mockReturnValue(expectedResult);

      expect(controller.search(ingredient)).toEqual(expectedResult);
      expect(service.searchByIngredient).toHaveBeenCalledWith(ingredient);
    });
  });

  describe('findOne', () => {
    it('should return a recipe by id', () => {
      const id = '1';
      const expectedResult = {
        id,
        title: 'Test Recipe',
        ingredients: [],
        instructions: [],
      };

      jest.spyOn(service, 'findOne').mockReturnValue(expectedResult);

      expect(controller.findOne(id)).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when recipe is not found', () => {
      const id = 'nonexistent';

      jest.spyOn(service, 'findOne').mockReturnValue(undefined);

      expect(() => controller.findOne(id)).toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a recipe', () => {
      const id = '1';
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
      };
      const expectedResult = {
        id,
        title: 'Updated Recipe',
        ingredients: [],
        instructions: [],
      };

      jest.spyOn(service, 'update').mockReturnValue(expectedResult);

      expect(controller.update(id, updateRecipeDto)).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateRecipeDto);
    });

    it('should throw NotFoundException when recipe to update is not found', () => {
      const id = 'nonexistent';
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
      };

      jest.spyOn(service, 'update').mockReturnValue(undefined);

      expect(() => controller.update(id, updateRecipeDto)).toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(id, updateRecipeDto);
    });
  });

  describe('remove', () => {
    it('should remove a recipe', () => {
      const id = '1';
      
      jest.spyOn(service, 'remove').mockReturnValue(true);

      controller.remove(id);
      
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when recipe to remove is not found', () => {
      const id = 'nonexistent';

      jest.spyOn(service, 'remove').mockReturnValue(false);

      expect(() => controller.remove(id)).toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});