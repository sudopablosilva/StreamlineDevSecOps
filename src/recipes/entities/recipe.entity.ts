import { ApiProperty } from '@nestjs/swagger';

export class Recipe {
  @ApiProperty({ description: 'The unique identifier of the recipe' })
  id: string;

  @ApiProperty({ description: 'The name of the recipe' })
  name: string;

  @ApiProperty({ description: 'List of ingredients', type: [String] })
  ingredients: string[];

  @ApiProperty({ description: 'Cooking instructions' })
  instructions: string;
}
