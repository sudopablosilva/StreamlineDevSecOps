# Build stage
FROM public.ecr.aws/docker/library/node:22-alpine as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

RUN touch dist

# Runtime stage
FROM public.ecr.aws/docker/library/node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy built application from build stage
COPY --from=build /usr/src/app/dist ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "main"]
