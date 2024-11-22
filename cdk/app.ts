#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { PipelineStack } from './pipeline-stack';

const app = new App();
new PipelineStack(app, 'EcsServicePipeline', {
  env: { account: '464380571579', region: 'us-east-1' }, // Pipeline will be created in this environment
});
app.synth();