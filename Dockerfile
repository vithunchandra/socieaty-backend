# --- Stage 1: Builder ---
# Use a Node.js LTS image based on Debian.
# This is compatible with your Ubuntu VM's package manager (apt).
FROM node:lts as builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and lock file first for caching.
COPY package*.json ./

# Install Node.js dependencies.
RUN npm install --production # Or 'yarn install --production'

# --- Install System Dependencies needed for the Build Stage ---
# Install FFmpeg and potentially other tools like git using apt-get.
# 'apt-get update' is needed before installing new packages.
# '-y' automatically confirms the installation.
RUN apt-get update && apt-get install -y ffmpeg git

# Copy the rest of your application code.
COPY . .

# Build your NestJS application (compile TypeScript).
# *** IMPORTANT: Ensure 'npm run build' exists and works in your package.json ***
RUN npm run build

# -----------------------------------------------------------------------------------

# --- Stage 2: Runner ---
# The final image, also based on Node.js LTS Debian.
FROM node:lts

# Set the working directory for the runtime.
WORKDIR /

# --- Install System Dependencies needed for Running FFmpeg ---
# Install FFmpeg in the final runtime image using apt-get.
# Include 'apt-get update' here too, as the base image might be older.
RUN apt-get update && apt-get install -y ffmpeg

# Copy only the essential files from the builder stage.
# <--- ADJUST THIS PATH IF YOUR BUILD OUTPUT IS NOT IN ./dist
COPY --from=builder /dist ./dist              
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./

# Expose the port your NestJS application listens on.
# <--- MAKE SURE THIS MATCHES THE PORT YOUR NESTJS APP IS CONFIGURED TO LISTEN ON
EXPOSE 3000 

# Define the command that runs when the container starts.
# This runs migrations then starts the app.
# *** IMPORTANT: YOU MUST ADJUST THESE COMMANDS TO MATCH YOUR SCRIPTS IN package.json ***
CMD npx mikro-orm migration:up && npm run start:prod
# Make sure 'npm run migration:run' runs your database migrations.
# Make sure 'npm run start:prod' starts your compiled production application.

# Alternative: Entrypoint script for more complex startup logic (like waiting for DB)
# COPY entrypoint.sh .
# RUN chmod +x entrypoint.sh
# ENTRYPOINT [ "./entrypoint.sh" ]
# CMD []