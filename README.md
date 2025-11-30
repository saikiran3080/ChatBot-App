# 🤖 Full-Stack AI Chatbot Application  
A complete end-to-end chatbot built with **React (Frontend)** and **Spring Boot (Backend)**, integrating **Llama 3.2 model streaming** using **EventSource** to deliver real-time responses.  
This app supports **user authentication**, **multi-chat threads**, **local session storage**, and a clean chat UI with streaming messages.

---

## 🚀 Tech Stack

### **Frontend (React)**
- React + Hooks  
- EventSource (Real-time streaming from backend)  
- Context API for Auth  
- LocalStorage for multi-chat sessions  
- Custom Chat UI (Composer, Typing Indicator, Message Bubbles)  
- Fetch + Streaming API

### **Backend (Spring Boot)**
- Spring Boot 3  
- Spring Web (REST APIs)  
- Llama 3.2 integration  
- Server-Sent Events (SSE) for streaming responses  
- JSON inputs / outputs  
- Proper CORS setup  
- Authentication endpoints

---

## ✨ Features

### **🔐 Authentication**
- User Login / Logout  
- Conditionally showing UI based on user status  
- Persistent login state

### **💬 Chat System**
- Multi-chat session support  
- Each chat stored separately  
- LocalStorage persistence  
- Real-time streaming messages from backend  
- Typing indicator  
- Clean UI design

### **⚙ Backend AI Integration**
- Calls Llama model  
- Streams partial output using **SSE (Server-Sent Events)**  
- Sends data to frontend in `{ data: "content" }` events  
- Handles errors gracefully

### **🛠 Developer Friendly**
- Easy to run  
- Clear folder structure  
- Can be deployed separately or together  

---

## 🏁 Getting Started

### 📌 **Backend Setup (Spring Boot)**

1. Open terminal inside `ChatApp-BE`
2. Run:

```bash
mvn clean install
mvn spring-boot:run
```
3 . Backend will start on:
http://localhost:8080

📌 Frontend Setup (React)

Open terminal inside ChatApp-FE

Install dependencies:
npm install
npm start
http://localhost:5173

🔗 API Endpoints
Chat Streaming
POST /api/chat/stream


Request Body:

{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}

Response: (SSE Streaming)

data: {"content": "Hello! How can I assist you?"}
data: {"content": "..." }

🔧 Important Concepts Used
1. EventSource Streaming

Used to receive partial responses continuously:

const eventSource = new EventSource(url);
eventSource.onmessage = (event) => {
   const chunk = JSON.parse(event.data);
   updateUI(chunk.content);
};

2. Multi-Chat Storage

Chats stored inside LocalStorage:

localStorage.setItem("chat_sessions", JSON.stringify(sessions));

3. Auth Context

Used to show/hide UI components:
const { currentUser } = useAuth();


🧑‍💻 Author

Sai Kiran Vakada
Full Stack Developer (React + Spring Boot)

Llama Integration, SSE Streaming
GitHub: your GitHub link here


