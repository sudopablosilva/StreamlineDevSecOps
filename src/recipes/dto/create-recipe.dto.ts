import { IsString, IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({ description: 'The name of the recipe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'List of ingredients', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({ description: 'Cooking instructions' })
  @IsString()
  @IsNotEmpty()
  instructions: string;
}
