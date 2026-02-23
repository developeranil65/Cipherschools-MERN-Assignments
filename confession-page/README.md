# Anonymous Confession Wall

A MERN stack application where users can log in via **Google OAuth 2.0**, post **anonymous confessions** with a secret code and category, and **react** to confessions. Users can **edit** or **delete** their confessions by entering the correct secret code.

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React 19 + Vite                     |
| Backend        | Node.js + Express.js                |
| Database       | MongoDB + Mongoose                  |
| Authentication | Google OAuth 2.0 via Passport.js    |
| Security       | bcrypt.js (secret code hashing)     |

## Features

- **Google OAuth 2.0 Login** — Users authenticate via Google before posting.
- **Anonymous Confessions** — Posts are displayed without any identifying information.
- **Secret Codes** — A 4+ character code is set at creation and used to verify edits/deletes (hashed with bcrypt, never stored in plain text).
- **Categories** — Confessions can be tagged as Crush, Study, Funny, or Secret.
- **Reactions** — Like, Love, and Laugh buttons with animated counters.
- **Personal History** — Users can view, edit, and delete their own confessions.


## API Endpoints

| Method   | Endpoint                      | Auth Required | Description                |
| -------- | ----------------------------- | ------------- | -------------------------- |
| `GET`    | `/auth/google`                | No            | Redirect to Google consent |
| `GET`    | `/auth/google/callback`       | No            | OAuth callback handler     |
| `GET`    | `/auth/logout`                | No            | Logout and destroy session |
| `GET`    | `/auth/current-user`          | No            | Get logged-in user or null |
| `POST`   | `/api/confessions`            | Yes           | Create a confession        |
| `GET`    | `/api/confessions`            | No            | Get all confessions        |
| `GET`    | `/api/confessions/mine`       | Yes           | Get user's confessions     |
| `PUT`    | `/api/confessions/:id`        | Secret Code   | Update confession text     |
| `DELETE` | `/api/confessions/:id`        | Secret Code   | Delete confession          |
| `POST`   | `/api/confessions/:id/react`  | No            | Add a reaction             |

## Database Schema

### User

| Field         | Type   | Description                    |
| ------------- | ------ | ------------------------------ |
| `googleId`    | String | Unique Google account ID       |
| `displayName` | String | User's display name            |
| `email`       | String | Email address                  |
| `avatar`      | String | Profile photo URL              |

### Confession

| Field        | Type   | Description                                  |
| ------------ | ------ | -------------------------------------------- |
| `text`       | String | The confession content (10–1000 chars)       |
| `secretCode` | String | bcrypt-hashed secret code (min 4 chars)      |
| `category`   | String | One of: crush, study, funny, secret          |
| `reactions`  | Object | `{ like: Number, love: Number, laugh: Number }` |
| `userId`     | String | Reference to User (not exposed in responses) |
| `createdAt`  | Date   | Auto-generated timestamp                     |

## Prerequisites

- **Node.js** v18+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Google Cloud Console** project with OAuth 2.0 credentials

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd confession-page
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and fill in your values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/confession-wall
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=any-random-string
CLIENT_URL=http://localhost:5173
```

### 3. Set up Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Select **Web Application**
6. Add **Authorised JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:5173`
7. Add **Authorised redirect URIs**:
   - `http://localhost:3000/auth/google/callback`
8. Copy the **Client ID** and **Client Secret** into your `.env` file

### 4. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Start the application

```bash
# Terminal 1 — Backend server
cd server
npm run dev

# Terminal 2 — Frontend dev server
cd client
npm run dev
```

### 6. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Secret Code Rules

- Minimum **4 characters**
- Set when creating a confession
- Required to **edit** or **delete** a confession
- Stored as a **bcrypt hash** (never in plain text)
- If the wrong code is entered, an error message is shown

## Screenshots

Once you run the app:
- **Login Page** — Full-page Google Sign-In with branding
- **Campus Feed** — Masonry grid of confession cards with reactions
- **My History** — Profile card with user stats, inline editing

## License

This project is for educational purposes.
