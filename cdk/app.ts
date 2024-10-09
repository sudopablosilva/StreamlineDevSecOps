import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from './pipeline-stack';

const app = new cdk.App();
new PipelineStack(app, 'RecipesPipelineStack', {
  env: {
    account: '314716890391',
    region: 'us-east-1',
  },
});