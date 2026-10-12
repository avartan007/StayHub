# WanderLust 🏡

A full-stack Airbnb-inspired rental listing platform built with **Node.js**, **Express**, **MongoDB**, and **EJS**.

## ✨ Features

- 🔍 **Search** listings by title, location, or country
- 📋 **Filter** by category (Beach, Mountains, Castles, etc.)
- 🔐 **Authentication** — Sign up, Log in, Log out (Passport.js)
- 🏠 **CRUD Listings** — Create, Read, Update, Delete your listings
- ⭐ **Reviews & Ratings** — Leave star ratings and comments
- 🗺️ **Interactive Map** — Leaflet.js with free OpenStreetMap tiles
- 📸 **Image Upload** — Upload listing photos (stored locally)
- 💰 **Tax Toggle** — Show prices with/without GST
- 📱 **Responsive Design** — Mobile-friendly Airbnb-style UI

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Backend    | Node.js, Express.js     |
| Database   | MongoDB, Mongoose       |
| Auth       | Passport.js (local)     |
| Views      | EJS, EJS-Mate           |
| Styles     | Bootstrap 5, Custom CSS |
| Map        | Leaflet.js + OpenStreetMap |
| Upload     | Multer                  |
| Validation | Joi                     |

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally

### Installation

```bash
git clone <your-repo-url>
cd wanderlust
npm install
```

### Set up environment variables

Create a `.env` file in the root:
```env
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SECRET=your-long-random-secret-key
```

### Seed the database

```bash
npm run init
```

### Run in development

```bash
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure

```
wanderlust/
├── controllers/       # Route handlers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── models/            # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/            # Express routers
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/             # EJS templates
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   └── users/
├── public/            # Static assets
│   ├── css/
│   ├── js/
│   └── uploads/
├── init/              # DB seed data
├── utils/             # Helpers
├── app.js             # Entry point
├── middleware.js      # Custom middleware
└── schema.js          # Joi validation schemas
```

## 🌐 Deployment

This app is ready to deploy on **Render** or **Railway**:

1. Push to GitHub
2. Connect your repo on [Render](https://render.com)
3. Set environment variables (`MONGO_URL`, `SECRET`)
4. Use `npm start` as start command

---

Made with ❤️ | WanderLust &copy; 2025