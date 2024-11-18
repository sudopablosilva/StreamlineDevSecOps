import { IsString, IsArray, IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({ description: 'The title of the recipe' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the recipe' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'List of ingredients', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({ description: 'List of instructions', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  instructions: string[];
}
