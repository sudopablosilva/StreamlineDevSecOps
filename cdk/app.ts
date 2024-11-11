import * as cdk from 'aws-cdk-lib';
import { EcsServiceStack } from './ecs-service-stack';

const app = new cdk.App();
new EcsServiceStack(app, 'RecipesService', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})