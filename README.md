# E-commerce Backend & Frontend

A full-stack e-commerce application with separate backend and frontend components.

## Features

- 🛍️ Product Management
- 📁 Category Management
- 🔐 User Authentication & Authorization
- 👤 User Profile Management
- 🛒 Shopping Cart
- ⚙️ Admin Dashboard
- 📸 Image Upload & Management
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Axios
- Lucide Icons

## Project Structure

```
.
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React context providers
│   │   ├── lib/        # Utility functions and API client
│   │   ├── pages/      # Page components
│   │   └── ...
│   └── ...
└── src/               # Node.js backend
    ├── config/        # Configuration files
    ├── controllers/   # Route controllers
    ├── middleware/    # Express middleware
    ├── models/        # Mongoose models
    ├── routes/        # Express routes
    ├── services/      # Business logic
    └── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js >= 14
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install backend dependencies:
\`\`\`bash
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

4. Create a .env file in the root directory:
\`\`\`
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
```

5. Create a .env file in the frontend directory:
\`\`\`
VITE_API_URL=http://localhost:5002
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

2. In a new terminal, start the frontend development server:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Product Endpoints

- GET `/api/products` - List all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Category Endpoints

- GET `/api/categories` - List all categories
- GET `/api/categories/:id` - Get single category
- POST `/api/categories` - Create category (Admin)
- PUT `/api/categories/:id` - Update category (Admin)
- DELETE `/api/categories/:id` - Delete category (Admin)

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/YourFeature\`
3. Commit your changes: \`git commit -am 'Add some feature'\`
4. Push to the branch: \`git push origin feature/YourFeature\`
5. Submit a pull request


### Avatar Storage
Create a `public/avatars` folder in the project root to store user profile images.  
This folder is ignored by Git and should be created manually on each deployment.


## License


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.