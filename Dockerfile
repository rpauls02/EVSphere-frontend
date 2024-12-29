# Step 1: Build the frontend
FROM node:18 AS frontend-builder
WORKDIR /usr/src/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

# Step 2: Set up the backend
FROM node:18
WORKDIR /usr/src/backend

# Set the environment variable for production
ENV NODE_ENV production

# Copy backend files (after setting NODE_ENV to ensure correct behavior in the server)
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./

# Copy the built frontend into the backend's public folder
COPY --from=frontend-builder /usr/src/frontend/build ./public

# Expose the port for the Express server
EXPOSE 3002

# Start the Express server
CMD ["node", "server.js"]
