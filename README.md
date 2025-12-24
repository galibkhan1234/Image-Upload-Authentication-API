# Image-Upload-Authentication-API

## Overview
A Node.js REST API that provides secure user authentication and image management.
Users can upload images to Cloudinary, retrieve them with pagination and sorting,
and delete only images they own.

## Features
- JWT-based authentication
- Protected routes using middleware
- Image upload with Multer
- Cloudinary integration
- Image ownership authorization
- Pagination and sorting
- MongoDB with Mongoose

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

## Project Structure
Controllers/
Models/
Routes/
Middlewares/
Helpers/
Config/

## Installation & Run
```bash
npm install
npm run dev
API Endpoints
Auth
POST /api/auth/register

POST /api/auth/login

Images
POST /api/images/upload (Protected)

GET /api/images (Protected, pagination & sorting)

DELETE /api/images/:id (Protected, owner only)

Security
JWT token verification

Authorization checks on delete

Secure file handling

Environment variables protecte



