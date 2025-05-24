# Animal Adoption Platform

A full-stack application for managing animal adoptions, built with React, Express.js, and PostgreSQL.

## Features

- User authentication and authorization
- Animal management (CRUD operations)
- Shelter management
- Responsive design

## Tech Stack

- Frontend: React.js
- Backend: Express.js
- Database: PostgreSQL
- ORM: Sequelize
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Local Development Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your local configuration

4. Start the development servers:
```bash
# Start backend server (from root directory)
npm run server

# Start frontend server (from client directory)
npm start
```

## Deployment

### Backend Deployment (Render.com)

1. Create a free account on [Render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository
5. Render will automatically detect the configuration from `render.yaml`

### Frontend Deployment (Vercel)

1. Create a free account on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure the following environment variables:
   - `REACT_APP_API_URL`: Your Render.com backend URL

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=animal_adoption
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
