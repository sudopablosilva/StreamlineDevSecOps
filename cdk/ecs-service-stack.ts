import { DefaultStackSynthesizer, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class EcsServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'NestRecipesAppVpc', { maxAzs: 2 });

    const cluster = new Cluster(this, 'NestRecipesAppCluster', { vpc });

    const qualifier = this.node.tryGetContext('aws:cdk:qualifier') ?? DefaultStackSynthesizer.DEFAULT_QUALIFIER;
    const registry = Repository.fromRepositoryName(this, 'CdkAssetRepository', 
      `cdk-${qualifier}-container-assets-${this.account}-${this.region}`,
    );
    const tag = this.node.tryGetContext('tag') ?? 'latest';

    new ApplicationLoadBalancedFargateService(this, 'NestRecipesAppService', {
      cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ContainerImage.fromEcrRepository(registry, tag),
        containerPort: 3000,
      },
      memoryLimitMiB: 512,
      publicLoadBalancer: true,
    });

  }
}