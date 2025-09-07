# Use Node.js 20
FROM node:20-alpine

# Install build dependencies for canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application with environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_KEY
ARG EMAIL_USER
ARG EMAIL_PASS
ARG RESEND_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_KEY=$SUPABASE_KEY
ENV EMAIL_USER=$EMAIL_USER
ENV EMAIL_PASS=$EMAIL_PASS
ENV RESEND_API_KEY=$RESEND_API_KEY

RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
