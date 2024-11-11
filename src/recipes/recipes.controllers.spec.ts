
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

describe('RecipesController', () => {
  let controller: RecipesController;

  const mockRecipesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe', async () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: 'step1',
      };

      mockRecipesService.create.mockResolvedValue(createRecipeDto);

      expect(await controller.create(createRecipeDto)).toEqual(createRecipeDto);
      expect(mockRecipesService.create).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('findAll', () => {
    it('should return array of recipes', async () => {
      const result = [
        {
          id: 1,
          title: 'Recipe 1',
          ingredients: ['ingredient1'],
          instructions: ['step1'],
          preparationTime: 20,
          difficulty: 'easy'
        }
      ];

      mockRecipesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single recipe', async () => {
      const result = {
        id: "1",
        title: 'Recipe 1',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        preparationTime: 20,
        difficulty: 'easy'
      };

      mockRecipesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockRecipesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
      };

      const result = {
        id: '1',
        ...updateRecipeDto
      };

      mockRecipesService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateRecipeDto)).toEqual(result);
      expect(mockRecipesService.update).toHaveBeenCalledWith('1', updateRecipeDto);
    });
  });

  describe('remove', () => {
    it('should remove a recipe', async () => {
      const result = { deleted: true };
      
      mockRecipesService.remove.mockResolvedValue(result);

      await controller.remove('1');
      expect(mockRecipesService.remove).toHaveBeenCalledWith('1');
    });
  });
});