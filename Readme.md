# 📺 YouTubeChai - Video Platform API

A full-stack backend REST API for a YouTube-like video platform built with Node.js, Express, MongoDB, and Mongoose.

This API supports features like user authentication, video upload and publish, playlists, likes, subscriptions, and comments.

---

## 🚀 Deployment

- **Backend URL:** `https://chaiwithback.onrender.com/api/v1`
- **API Docs:** [Postman Public Collection](https://www.postman.com/collections/43779070-b7309a15-5d55-4e81-b27d-5200badfa330)

---

## 🧪 Features

✅ JWT-based Authentication  
✅ CRUD operations on Videos & Playlists  
✅ Commenting system  
✅ Toggle publish, like, and subscribe  
✅ Cloudinary image/video storage  
✅ MongoDB & Mongoose integration  
✅ Pagination & filtering

---

## 📚 API Endpoints Overview

### 🧑 Auth Routes `/user`

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | `/register`       | Register a new user  |
| POST   | `/login`          | Log in and get token |
| POST   | `/logout`         | Logout the user      |
| POST   | `/refresh-token`  | Get new access token |
| POST   | `/changePassword` | Change password      |
| GET    | `/getHistory`     | Get watch history    |

---

### 📹 Video Routes `/videos`

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/uploadVideo`      | Upload a new video         |
| GET    | `/getAllVideos`     | Get all videos (paginated) |
| GET    | `/getVideoById/:id` | Get a single video         |
| PATCH  | `/deleteVideo`      | Soft delete a video        |
| PATCH  | `/isTogglePublish`  | Toggle publish/unpublish   |

---

### 💬 Comment Routes `/comments`

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | `/:videoId` | Get comments for a video |
| POST   | `/:videoId` | Post a new comment       |

---

### 🎞️ Playlist Routes `/playlists`

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| POST   | `/createPlaylist`          | Create new playlist        |
| GET    | `/getPlaylistById/:id`     | Get playlist details       |
| PATCH  | `/removeVideoFromPlaylist` | Remove video from playlist |

---

### ❤️ Like Routes `/like`

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | `/toggleLike/:videoId` | Like/unlike a video |

---

### 🔔 Subscription Routes `/subscription`

| Method | Endpoint                         | Description                          |
| ------ | -------------------------------- | ------------------------------------ |
| POST   | `/toggleSubscription/:channelId` | Subscribe/unsubscribe from a channel |

---

## 🔐 Authorization

Most routes are protected via JWT tokens.  
Include this header in your requests:

```
Authorization: Bearer <your_token>
```

---

## 🧾 How to Use the API

1. Import the [Postman Collection](https://www.postman.com/collections/43779070-b7309a15-5d55-4e81-b27d-5200badfa330)
2. Set `{{productionserver}}` environment variable as:

   ```
   {{productionserver}} = https://chaiwithback.onrender.com/api/v1
   ```

3. Register or login to get JWT
4. Use `Authorization` header to test protected routes

---

## 🧑‍💻 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary (for media storage)
- JWT Authentication
- Postman for API testing

---

## 📝 Author

**Sourav Gaur**  
Final Year CSE Student, UIET Kurukshetra  
GitHub: https://github.com/SouravGaur

---

## 📌 Resume Summary

```
Built and deployed a complete backend API for a YouTube-like video platform using Node.js, Express, MongoDB, JWT, and Cloudinary.
Tested with Postman. Documentation available here: https://www.postman.com/collections/43779070-b7309a15-5d55-4e81-b27d-5200badfa330
Deployed backend: https://chaiwithback.onrender.com
{{productionserver}}:https://chaiwithback.onrender.com/api/v1
```
