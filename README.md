# NestJS Recipes API with AWS CDK Deployment

This project is a NestJS-based RESTful API for managing recipes, deployed using AWS CDK with a CI/CD pipeline.

The Recipes API provides endpoints for creating, reading, updating, and deleting recipes, as well as searching recipes by ingredients. It is built with NestJS, a progressive Node.js framework, and uses TypeScript for type-safe development. The application is containerized using Docker and deployed to Amazon ECS (Elastic Container Service) using AWS CDK (Cloud Development Kit).

The project includes a robust CI/CD pipeline implemented with AWS CodePipeline, which automates the build, test, and deployment processes. It incorporates security scans, end-to-end testing, and multi-region deployment capabilities.

## Repository Structure

```
.
├── cdk
│   ├── app.ts
│   ├── ecs-service-stack.ts
│   └── pipeline-stack.ts
├── e2e
│   └── api.spec.ts
├── src
│   ├── app.module.ts
│   ├── health.controller.ts
│   ├── main.ts
│   └── recipes
│       ├── dto
│       ├── entities
│       ├── recipes.controller.ts
│       ├── recipes.module.ts
│       └── recipes.service.ts
├── Dockerfile
├── cdk.json
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

### Key Files:
- `src/main.ts`: Entry point for the NestJS application
- `src/recipes/recipes.controller.ts`: Controller for recipe-related endpoints
- `src/recipes/recipes.service.ts`: Service layer for recipe operations
- `cdk/app.ts`: Entry point for the CDK application
- `cdk/pipeline-stack.ts`: Defines the CI/CD pipeline
- `cdk/ecs-service-stack.ts`: Defines the ECS service infrastructure
- `Dockerfile`: Defines the container image for the application
- `playwright.config.ts`: Configuration for end-to-end tests

## Usage Instructions

### Prerequisites
- Node.js v22 or later
- Yarn package manager
- AWS CLI configured with appropriate credentials
- Docker (for local development and testing)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Build the application:
   ```
   yarn build
   ```

### Running the Application Locally

1. Start the application:
   ```
   yarn start
   ```

2. The API will be available at `http://localhost:3000/api`

### API Endpoints

- `POST /api/recipes`: Create a new recipe
- `GET /api/recipes`: Get all recipes (with pagination)
- `GET /api/recipes/search`: Search recipes by ingredient
- `GET /api/recipes/:id`: Get a specific recipe by ID
- `PUT /api/recipes/:id`: Update a specific recipe
- `DELETE /api/recipes/:id`: Delete a specific recipe

### Testing

Run unit tests:
```
yarn test
```

Run end-to-end tests:
```
yarn test:e2e
```

### Deployment

The application is automatically deployed through the CI/CD pipeline defined in `cdk/pipeline-stack.ts`. The pipeline is triggered on pushes to the main branch of the repository.

To manually deploy the CDK stacks:

1. Synthesize the CloudFormation template:
   ```
   yarn cdk:synth
   ```

2. Deploy the stacks:
   ```
   yarn cdk:deploy --all
   ```

## Account and Region Configuration

This project is configured to deploy across multiple AWS accounts and regions for different environments. The main configuration is defined in `cdk/app.ts` and `cdk/pipeline-stack.ts`.

1. Pipeline Account and Region:
   - Account ID: 211125471568
   - Region: us-east-1

2. Deployment Environments:
   - Gamma (Staging):
     - Account ID: 211125471568
     - Regions: us-west-2
   - Production (Commented out in the current configuration):
     - Account ID: 211125471568
     - Regions: us-east-2, eu-west-1

To modify the account and region configuration:
1. Update the `env` property in the `PipelineStack` constructor in `cdk/app.ts`.
2. Modify the `ApplicationStage` instances in `cdk/pipeline-stack.ts` for each environment.

## Bootstrapping AWS Accounts and Regions

Before deploying the CDK stacks, you need to bootstrap the AWS accounts and regions. Bootstrapping sets up the necessary resources for CDK to manage deployments.

To bootstrap an account and region:

1. Configure your AWS CLI with the appropriate credentials for the target account.

2. Run the following command, replacing `<account-id>` and `<region>` with your specific values:
   ```
   npx cdk bootstrap aws://<account-id>/<region>
   ```
3. Run the following command to trust the pipeline account, replacing `<account-id>`, `<pipeline-account-id>` and `<region>` with your specific values:
   ```
   npx cdk bootstrap aws://<account-id>/<region> --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --trust <pipeline-account-id> --trust-for-lookup <pipeline-account-id>
   ```
4. Repeat this process for each account and region combination used in your deployment.

## Pipeline Security Process

The CI/CD pipeline includes several security measures to ensure the safety and integrity of the application:

1. Static Application Security Testing (SAST):
   - Tool: Semgrep
   - Command: `semgrep scan --config auto`
   - Purpose: Analyzes source code for potential security vulnerabilities.

2. Software Composition Analysis (SCA):
   - Tool: Grype
   - Command: `grype .`
   - Purpose: Scans dependencies for known vulnerabilities.

3. Software Bill of Materials (SBOM) Generation:
   - Tool: Syft
   - Command: `syft . -o json > sbom.json`
   - Purpose: Creates a detailed inventory of all software components.

4. Secrets Scanning:
   - Tool: Gitleaks
   - Command: `gitleaks detect --source . --no-git -v`
   - Purpose: Detects potential secrets or sensitive information in the codebase.

These security scans are performed in the "Gamma Wave" of the pipeline, before any deployment occurs. If any of these scans fail, the pipeline will stop, preventing potentially vulnerable code from being deployed.

## Testing Strategy

The project employs a comprehensive testing strategy that includes:

1. Unit Tests:
   - Run with: `yarn test`
   - Located in: `src/**/*.spec.ts` files
   - Purpose: Test individual components and functions in isolation.

2. End-to-End (E2E) Tests:
   - Run with: `yarn test:e2e`
   - Located in: `e2e/` directory
   - Configuration: `playwright.config.ts`
   - Purpose: Test the entire application flow in a deployed environment.

3. Post-Deployment Tests:
   - Executed automatically after deployment to each environment.
   - Uses Playwright to run E2E tests against the deployed application.
   - Command:
     ```
     yarn install
     npx playwright install --with-deps
     npx playwright test
     ```
   - Purpose: Verify that the deployed application is functioning correctly in the target environment.

The pipeline is configured to run unit tests during the build phase and E2E tests after deployment to each environment. This ensures that the application is thoroughly tested at multiple stages of the deployment process.

## Troubleshooting

1. If you encounter issues with the CDK deployment:
   - Ensure your AWS CLI is correctly configured with the right credentials and region.
   - Check the CloudFormation console in the AWS Management Console for detailed error messages.
   - Run `yarn cdk:diff` to see what changes will be applied before deployment.

2. For application runtime issues:
   - Check the application logs in Amazon CloudWatch Logs.
   - Ensure the ECS task has the necessary permissions to access any required AWS resources.

3. If end-to-end tests are failing:
   - Verify that the application is accessible at the URL specified in the `playwright.config.ts` file.
   - Check the Playwright test output for detailed error messages.

## Data Flow

The request data flow through the application follows these steps:

1. Client sends a request to the API endpoint.
2. The request is received by the NestJS application running in an ECS Fargate task.
3. The `RecipesController` handles the request and calls the appropriate method in the `RecipesService`.
4. The `RecipesService` performs the requested operation on the in-memory recipe data store.
5. The result is returned through the controller back to the client.

```
Client -> API Gateway -> ALB -> ECS Fargate (NestJS App) -> RecipesController -> RecipesService -> In-memory Store
```

Note: The current implementation uses an in-memory data store. For production use, consider implementing a persistent database solution.

## Infrastructure

The infrastructure is defined using AWS CDK and consists of the following main components:

- VPC: `NestRecipesAppVpc`
  - Purpose: Provides the networking foundation for the application

- ECS Cluster: `NestRecipesAppCluster`
  - Purpose: Manages the Fargate tasks running the application

- Application Load Balancer: Created by `ApplicationLoadBalancedFargateService`
  - Purpose: Distributes incoming traffic to the Fargate tasks

- Fargate Service: `NestRecipesAppService`
  - Purpose: Runs the containerized application
  - Configuration:
    - CPU: 256 units
    - Memory: 512 MiB
    - Desired count: 1 task
    - Container port: 3000

- CodePipeline: `EcsServicePipeline`
  - Purpose: Manages the CI/CD process
  - Stages:
    - Source: Connects to the GitHub repository
    - Build: Installs dependencies, runs tests, and synthesizes CDK stacks
    - Security Scans: Performs SAST, SCA, SBOM generation, and secrets scanning
    - Deploy to Gamma: Deploys to the us-west-2 region and runs E2E tests

The infrastructure is deployed across multiple AWS regions for high availability and disaster recovery.
