import { Module } from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [RecipesModule, TerminusModule],
  controllers: [HealthController],
})
export class AppModule {}