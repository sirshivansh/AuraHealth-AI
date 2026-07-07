# AuraHealth AI

An intelligent, empathetic wellness companion platform designed to help users track their health metrics, analyze symptoms, and interact with an AI health assistant.

## Features
- **Intent-Based Dashboard**: Track hydration, sleep, and BMI with an intuitive interface.
- **AI Wellness Chat**: Get real-time, personalized wellness advice using Groq's high-performance LLM APIs.
- **Symptom Checker**: Enter symptoms to receive a structured analysis, possible causes, and precautions.
- **Premium UI**: Designed with an accessible, high-contrast dark glassmorphic aesthetic using Tailwind CSS and Framer Motion.

## Quick Start

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file in the project root and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   This will start both the Express backend (port 5000) and the Vite frontend (port 3000).

## Architecture
```
src/
├── app/          # App setup, context providers, routing
├── assets/       # Styles, images
├── components/   # Shared layout and UI components
├── features/     # Domain-specific pages (chat, dashboard, landing, symptoms)
├── hooks/        # Custom React hooks
└── lib/          # API client and constants
server/
└── index.js      # Express backend handling Groq API integration
```

## Tech Stack
- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI Integration**: Groq SDK (`llama-3.1-8b-instant`)

## License
MIT License
