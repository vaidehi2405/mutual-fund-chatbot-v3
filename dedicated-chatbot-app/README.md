# Dedicated Chatbot App (React + Vite)

This is a standalone, high-fidelity frontend built to provide a minimalist, chat-centric journey for Groww Mutual Fund users.

## 🚀 Getting Started

Since this is a React source-only project, follow these steps to run it on your local machine:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **NPM** or **Yarn**

### 2. Setup
1. Copy the `dedicated-chatbot-app` folder to your local machine.
2. Open your terminal in that folder.
3. Install dependencies:
   ```bash
   npm install
   ```

### 3. Run Development Server
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`.

### 4. Backend Connectivity
Ensure your Python backend is running on `http://localhost:8000`. The chat interface is pre-configured to point to this address.

## 🍱 Key Features
- **Minimalist Hero**: A clean, centered landing page focused entirely on the user's first question.
- **Centered Chat Window**: A prominent, shadow-heavy card UI with smooth animations.
- **Stateless Journey**: No session memory required; focus on providing factual fund data instantly.
- **Fine-tuned UX**: Quick-start prompt chips and high-contrast readable message bubbles.

## 🎨 Tech Stack
- **React 18**
- **Vite** (Fast Build/HMR)
- **Tailwind CSS** (Modern, responsive styling)
- **Lucide Icons** (Minimalist UI elements)
- **TypeScript** (Safe, maintainable logic)
