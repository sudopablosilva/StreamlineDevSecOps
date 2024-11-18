import { ApiProperty } from '@nestjs/swagger';

export class Recipe {
  @ApiProperty({ description: 'The unique identifier of the recipe' })
  id: number | string;

  @ApiProperty({ description: 'The title of the recipe' })
  title: string;

  @ApiProperty({ description: 'The description of the recipe' })
  description?: string;

  @ApiProperty({ description: 'List of ingredients', type: [String] })
  ingredients: string[];

  @ApiProperty({ description: 'List of instructions', type: [String] })
  instructions: string[];
}
