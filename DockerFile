FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies like nodemon)
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the application's port
EXPOSE 8000

# Command to start the application
CMD ["npm", "run", "dev"]
