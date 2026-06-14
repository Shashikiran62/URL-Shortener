# URL Shortener - MERN Stack Application

A modern, full-stack URL shortening service built with the MERN stack (MongoDB, Express.js, React, Node.js). Transform your long URLs into short, shareable links with analytics and a beautiful user interface.

## ✨ Features

- 🔗 **URL Shortening**: Convert long URLs into short, memorable links
- 📊 **Analytics**: Track clicks and view statistics for your shortened URLs
- 🎨 **Modern UI**: Beautiful, responsive React frontend with smooth animations
- 🔒 **Secure**: Rate limiting, input validation, and security headers
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Fast**: Optimized for performance with efficient database queries
- 🔄 **Real-time**: Instant URL creation and live analytics updates

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **ShortID** - Unique short code generation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React** - User interface library
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Toastify** - Notifications
- **CSS3** - Modern styling with animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   npm run install-server
   
   # Install client dependencies
   npm run install-client
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **Run the application**
   ```bash
   # Start both client and server in development mode
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Server
   npm run server
   
   # Terminal 2 - Client
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Create Short URL
```http
POST /api/urls
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "http://localhost:5000/abc123",
  "shortCode": "abc123",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get All URLs
```http
GET /api/urls?page=1&limit=10
```

#### Get URL Details
```http
GET /api/urls/:shortCode
```

#### Get URL Statistics
```http
GET /api/urls/:shortCode/stats
```

#### Redirect to Original URL
```http
GET /:shortCode
```

## 🏗️ Project Structure

```
url-shortener/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/urlshortener |
| `NODE_ENV` | Environment mode | development |

### Database Schema

The application uses a simple URL model:

```javascript
{
  originalUrl: String,    // The original long URL
  shortUrl: String,       // The complete short URL
  shortCode: String,      // The short code (unique)
  clicks: Number,         // Click counter
  createdAt: Date,        // Creation timestamp
  expiresAt: Date,        // Optional expiration date
  lastAccessed: Date      // Last click timestamp
}
```

<p align="center">
  <img src="https://github.com/Shashikiran62/URL-Shortener/blob/main/Output/image1.png?raw=true" width="600" />
</p>


## 🚀 Deployment

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   PORT=5000
   ```

3. **Start the server**
   ```bash
   cd server
   npm start
   ```

### Docker Deployment (Optional)

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN npm run install-server
RUN npm run install-client

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "server"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend library
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://www.mongodb.com/) for the flexible database
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [ShortID](https://github.com/dylang/shortid) for unique ID generation

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---
In Terminal 1 (for Server):
npm run server

In Terminal 2 (for Client):
npm run client

**Happy URL Shortening! 🎉**
