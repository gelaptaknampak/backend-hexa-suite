# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose port (sesuaikan dengan port server kamu)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
