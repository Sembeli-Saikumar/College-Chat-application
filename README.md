<div align="center">

# 💬 CollegeChat

### Real-time Campus Messaging Platform with AI Assistant

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

A full-stack, real-time chat application built for college campus communities. Features direct messaging, group chats, AI-powered assistant, admin panel, file sharing, and a premium neon-purple dark UI.

</div>

---

## ✨ Features

### 🔐 Authentication
- Email/password sign-up and sign-in via Supabase Auth
- Auto-generated user profiles on signup (via database trigger)
- Admin role auto-assigned based on configured admin email
- Protected routes — unauthenticated users are redirected to `/login`
- Blocked users cannot access the platform

### 💬 Real-Time Messaging
- **Direct Messages (DM)** — 1-on-1 private chats between users
- **Group Messages** — Create and join group conversations
- **Real-time updates** — Messages appear instantly via Supabase Realtime subscriptions
- **Typing indicators** — See when someone is typing
- **Message status** — Sent → Delivered → Seen indicators
- **File sharing** — Upload and share images and files in chat
- **Message deletion** — Delete your own messages

### 🤖 AI Assistant (Gemini)
- Built-in AI chatbot powered by **Google Gemini Flash**
- Helps students with study tips, project ideas, and general questions
- Conversational memory within the session
- Always available in the sidebar as "AI Assistant"

### 🛡️ Admin Panel (`/admin`)
- **User Management** — View all users, search, block/unblock, delete accounts
- **Group Management** — Create groups, add members, delete groups
- **Announcements** — Broadcast messages to all registered users
- **Dashboard Stats** — Total users, online count, blocked count, group count

### ⚙️ User Settings (`/settings`)
- Update profile (full name, username, college)
- Upload avatar (max 2MB)
- View email (read-only)

### 🎨 Premium UI/UX
- Neon purple dark theme with glassmorphism effects
- Smooth animations and micro-interactions
- Fully responsive — works on mobile, tablet, and desktop
- Custom gradient text, glow shadows, and blur effects
- Toast notifications with themed styling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, React Router v6 |
| **Styling** | TailwindCSS 3.4, Custom CSS variables |
| **State** | Zustand (global auth & chat stores) |
| **Backend** | Supabase (Auth, PostgreSQL, Realtime, Storage) |
| **AI** | Google Gemini Flash API |
| **Icons** | Lucide React |
| **Utilities** | date-fns, react-hot-toast, react-dropzone |

---

## 📁 Project Structure

```
college-chat/
├── public/                     # Static assets
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql      # Database tables, RLS policies, triggers
│       └── 002_storage.sql     # Storage bucket & policies
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatHeader.jsx      # Chat area header with user info
│   │   │   ├── MessageBubble.jsx   # Individual message component
│   │   │   ├── MessageInput.jsx    # Message input with file upload
│   │   │   ├── MessageList.jsx     # Scrollable message list
│   │   │   ├── Sidebar.jsx         # Sidebar with tabs (Chats/Groups/Alerts)
│   │   │   └── WelcomeScreen.jsx   # Empty state when no chat selected
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx     # Admin page wrapper
│   │   │   └── UserLayout.jsx      # User page wrapper
│   │   ├── shared/
│   │   │   ├── Avatar.jsx          # User avatar with online indicator
│   │   │   ├── EmptyState.jsx      # Generic empty state component
│   │   │   ├── MessageStatus.jsx   # Sent/Delivered/Seen indicator
│   │   │   └── TypingIndicator.jsx # Animated typing dots
│   │   └── user/
│   │       └── AIBotChat.jsx       # AI Assistant chat interface
│   ├── hooks/
│   │   ├── useMessages.js          # Message fetching & realtime subscription
│   │   ├── useNotifications.js     # Notification subscription
│   │   ├── useOnlineStatus.js      # Online presence tracking
│   │   └── useTyping.js            # Typing indicator logic
│   ├── lib/
│   │   └── gemini.js               # Gemini AI API integration
│   ├── pages/
│   │   ├── AdminPage.jsx           # Admin panel (users, groups, announcements)
│   │   ├── ChatPage.jsx            # Main chat view (sidebar + messages)
│   │   ├── LoginPage.jsx           # Login & signup with tab switching
│   │   └── SettingsPage.jsx        # User profile settings
│   ├── services/
│   │   ├── authService.js          # Auth operations (sign in/up/out)
│   │   ├── messageService.js       # Message CRUD & file upload
│   │   ├── supabase.js             # Supabase client instance
│   │   └── userService.js          # User, group, notification operations
│   ├── store/
│   │   ├── authStore.js            # Auth state (Zustand)
│   │   └── chatStore.js            # Chat state (Zustand)
│   ├── styles/
│   │   └── index.css               # Global styles, CSS variables, components
│   ├── App.jsx                     # Root component with routing
│   └── main.jsx                    # Entry point
├── .env.example                # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (free)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sembeli-Saikumar/College-Chat-application.git
cd College-Chat-application
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up
3. Navigate to **SQL Editor** in the Supabase dashboard
4. Run the following migration files **in order**:

   **First**, run `supabase/migrations/001_schema.sql`:
   - Creates all tables: `users`, `messages`, `groups`, `group_members`, `group_messages`, `typing_status`, `notifications`
   - Sets up indexes for performance
   - Creates auto-update triggers for `updated_at` columns
   - Creates the `handle_new_user()` trigger that auto-creates profiles on signup
   - Configures Row Level Security (RLS) policies
   - Enables Supabase Realtime for relevant tables

   **Then**, run `supabase/migrations/002_storage.sql`:
   - Creates the `chat-files` storage bucket
   - Sets up storage access policies for file upload/download

5. Go to **Settings → API** and copy your:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 4️⃣ Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy the generated key

### 5️⃣ Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAIL=your-email@gmail.com
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **Important**: The `VITE_ADMIN_EMAIL` determines which account gets admin privileges. Set this to **your email** before signing up.

### 6️⃣ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Login & Signup Flow

### Creating an Account (First Time)

1. Open the app → you'll see the **login page**
2. Click the **"Sign Up"** tab
3. Fill in:
   - **Full Name** — Your display name
   - **Username** — Unique username (auto-lowercased)
   - **College / University** — Your institution
   - **Email** — Your email address
   - **Password** — Minimum 6 characters
4. Click **"Create Account"**
5. ✅ Check your email for a confirmation link (Supabase requires email verification by default)
6. Click the link in your email to verify
7. Return to the app and sign in

### Signing In

1. Click the **"Sign In"** tab (default)
2. Enter your **email** and **password**
3. Click **"Sign In"**
4. You'll be redirected to the main chat page

### Admin Access

- The account registered with the email set in `VITE_ADMIN_EMAIL` automatically becomes an admin
- Admins see a **shield icon** 🛡️ in the sidebar to access `/admin`
- Admin privileges include: user management, group creation, broadcast announcements

### Demo Credentials

> If you've set up the project fresh, you need to **create your own account** using the Sign Up form. There are no pre-seeded accounts.

To create the **admin account**:
1. Set `VITE_ADMIN_EMAIL` to your email in `.env`
2. Sign up with that exact email
3. The database trigger will automatically grant admin role

---

## 🛡️ Admin Panel Guide

Access the admin panel by clicking the **shield icon** in the sidebar (visible only to admins), or navigate to `/admin`.

### Users Tab
| Action | Description |
|--------|-------------|
| **Search** | Filter users by name, email, or username |
| **Block/Unblock** | Toggle user access to the platform |
| **Delete** | Permanently remove a user account |

### Groups Tab
| Action | Description |
|--------|-------------|
| **Create Group** | Set name, description, and select members |
| **Delete Group** | Remove a group and all its messages |

### Announcements Tab
| Action | Description |
|--------|-------------|
| **Send Announcement** | Broadcast a message to ALL registered users |

---

## 🗄️ Database Schema

The app uses **7 tables** in Supabase PostgreSQL:

```
┌──────────────────┐     ┌──────────────────┐
│     users         │     │    messages       │
├──────────────────┤     ├──────────────────┤
│ id (PK, UUID)    │◄────│ sender_id (FK)   │
│ email            │◄────│ receiver_id (FK) │
│ full_name        │     │ content          │
│ username         │     │ file_url         │
│ avatar_url       │     │ file_type        │
│ college          │     │ status           │
│ is_online        │     │ created_at       │
│ last_seen        │     └──────────────────┘
│ is_admin         │
│ is_blocked       │     ┌──────────────────┐
│ created_at       │     │    groups         │
└──────────────────┘     ├──────────────────┤
         │               │ id (PK, UUID)    │
         │               │ name             │
         │               │ description      │
         ▼               │ created_by (FK)  │
┌──────────────────┐     └──────────────────┘
│  group_members   │              │
├──────────────────┤              │
│ group_id (FK)    │──────────────┘
│ user_id (FK)     │
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ group_messages   │     │  typing_status   │
├──────────────────┤     ├──────────────────┤
│ group_id (FK)    │     │ user_id (FK)     │
│ sender_id (FK)   │     │ receiver_id (FK) │
│ content          │     │ group_id (FK)    │
│ file_url         │     │ is_typing        │
│ file_type        │     └──────────────────┘
└──────────────────┘
                         ┌──────────────────┐
                         │  notifications   │
                         ├──────────────────┤
                         │ user_id (FK)     │
                         │ sender_id (FK)   │
                         │ type             │
                         │ content          │
                         │ is_read          │
                         └──────────────────┘
```

All tables have **Row Level Security (RLS)** enabled. See `supabase/migrations/001_schema.sql` for the full policy definitions.

---

## 🔒 Security

- **Row Level Security (RLS)** — Users can only read/write their own data
- **Admin-only operations** — User blocking, deletion, group creation, and announcements require admin role
- **Environment variables** — All secrets stored in `.env` (never committed to Git)
- **Supabase Auth** — Handles password hashing, session management, and JWT tokens
- **Email verification** — Required by default for new accounts

---

## 📱 Responsive Design

The app is fully responsive with a mobile-first layout:

| Screen Size | Layout |
|------------|--------|
| **Mobile** (< 768px) | Sidebar and chat area toggle visibility |
| **Tablet** (768px+) | Sidebar always visible, chat area fills remaining space |
| **Desktop** (1024px+) | Full sidebar + spacious chat area |

---

## 🏗️ Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting provider:
- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Make sure to set your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for campus communities**

[⬆ Back to Top](#-collegechat)

</div>
