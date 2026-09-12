# 🪴 Nook — A Cozy Life-RPG Task Tracker

> Turn real-life tasks into a cozy late-night study room.

**Nook** is a life-RPG task tracker that turns everyday tasks into meaningful game-like progression. Complete tasks to earn **Focus (XP)**, **Embers**, attribute growth, and streaks — then spend your Embers to decorate your personal Nook with cozy items like lamps, plants, posters, furniture, and a cat.

The idea is simple:

**Do the work → earn XP → grow your character → decorate your Nook.**

---

## ✨ Features

### 🎯 Task Management

* Create, edit, complete, and delete tasks
* Assign tasks a difficulty
* Assign tasks to one of five character attributes
* Optimistic UI for fast interactions
* Automatic rollback when an API request fails
* Loading, error, and retry states

### ⭐ XP & Leveling

Completing a task awards XP based on its difficulty.

Nook uses a non-linear leveling system, so each level requires progressively more XP.

```text
XP required ≈ 50 × level^1.6
```

This makes progression feel meaningful even as the player advances.

### 🔥 Embers

**Embers** are Nook's in-game currency.

Players earn Embers by completing tasks and can spend them in the Nook Shop to purchase room decorations.

### 📊 Character Attributes

Every task is associated with one of five attributes:

| Attribute     | Meaning                           |
| ------------- | --------------------------------- |
| 🧠 Focus      | Concentration and deep work       |
| ❤️ Vitality   | Energy and healthy habits         |
| 📚 Discipline | Consistency and follow-through    |
| 🎨 Creativity | Creative thinking and exploration |
| 🌙 Calm       | Balance and mental clarity        |

Completing a task increases the corresponding attribute.

### 🔥 Streaks

Stay consistent by completing tasks across consecutive calendar days.

Nook tracks:

* Current streak
* Longest streak
* Completion history

Streak calculations are handled on the server.

### 🏠 The Nook

Earn Embers and spend them on items to build your own cozy room.

The shop includes items such as:

* 💡 Lamps
* 🌱 Plants
* 🐈 Pets
* 🖼️ Posters
* 🪑 Furniture
* ✨ Other decorative items

Your room becomes a visual representation of your productivity.

---

# 🛠️ Tech Stack

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| **Next.js 14**    | Full-stack React framework |
| **App Router**    | Application routing        |
| **TypeScript**    | Type-safe development      |
| **Prisma**        | Database ORM               |
| **PostgreSQL**    | Production database        |
| **SQLite**        | Local development option   |
| **NextAuth.js**   | Authentication             |
| **bcrypt**        | Password hashing           |
| **Tailwind CSS**  | Styling                    |
| **Framer Motion** | Animations                 |

Nook is built as a **single Next.js application**. The frontend and backend live in the same repository, with Next.js API routes handling server-side operations.

---

# 🔐 Security & Anti-Cheating

A core requirement of Nook is that progression cannot be manipulated from the client.

All important progression values are calculated **server-side**.

The client cannot decide:

* XP rewards
* Ember rewards
* Attribute increases
* Level progression
* Streak updates
* Shop item prices

When a task is completed, the API retrieves the task from the database and calculates the rewards using the task's stored difficulty and attribute.

The server does not trust reward values sent by the browser.

Every protected API route also verifies the authenticated session and scopes database operations to the current user's `userId`.

Conceptually:

```text
Browser
   │
   │ API request
   ▼
Next.js API Route
   │
   ├── Verify session
   │
   ├── Get authenticated userId
   │
   ├── Query user's database records
   │
   ├── Calculate rewards server-side
   │
   └── Save changes
            │
            ▼
        Database
```

Changing client-side state through browser DevTools therefore does not change the actual stored progression.

> **The client displays progression. The server owns progression.**

---

# 🗄️ Database

Nook uses Prisma as its database ORM.

The main models are:

### `User`

Stores:

* Account information
* Password hash
* XP
* Level
* Embers
* Character attributes
* Current streak
* Longest streak

### `Task`

Stores:

* Task title
* Description
* Difficulty
* Associated attribute
* Completion status
* User ownership
* Timestamps

### `InventoryItem`

Stores the decorative items purchased by a user.

---

# 📁 Project Structure

```text
nook/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   └── shop/
│   │   │
│   │   └── (pages)/
│   │       ├── landing/
│   │       ├── login/
│   │       ├── register/
│   │       └── dashboard/
│   │
│   ├── components/
│   │   ├── RoomScene
│   │   ├── XPBar
│   │   ├── TaskList
│   │   ├── Shop
│   │   └── ...
│   │
│   └── lib/
│       ├── xp.ts
│       ├── streak.ts
│       ├── shop.ts
│       └── auth.ts
│
├── .env.example
├── package.json
├── tailwind.config.*
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 18+
* npm
* Git
* A PostgreSQL database for production

---

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd nook
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
```

Add your database and authentication configuration:

```env
DATABASE_URL="your-database-connection-string"
DIRECT_URL="your-direct-database-connection-string"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Generate a secure NextAuth secret

Run:

```bash
openssl rand -base64 32
```

Copy the generated value into:

```env
NEXTAUTH_SECRET="your-generated-secret"
```

> **Never commit `.env` or real database credentials to GitHub.**

---

## 4. Configure Prisma

For PostgreSQL, the Prisma datasource should use:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## 5. Set up the database

Generate the Prisma client:

```bash
npx prisma generate
```

Push the schema to your database:

```bash
npx prisma db push
```

For development projects using Prisma migrations, you can instead use:

```bash
npx prisma migrate dev --name init
```

---

## 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📈 Progression System

## XP

XP is awarded when a task is completed.

The reward is calculated using the task's difficulty stored in the database.

The client never supplies the reward amount.

Nook uses a non-linear leveling curve:

```text
XP required ≈ 50 × level^1.6
```

Each additional level therefore requires more XP than the previous one.

---

## 🔥 Embers

Embers are earned through task completion.

They can be spent in the Nook Shop to purchase decorative items.

Shop prices are stored and validated server-side, preventing the client from changing the price of an item.

---

## 📊 Attributes

The five character attributes are:

```text
Focus
Vitality
Discipline
Creativity
Calm
```

Each completed task increases the attribute associated with that task.

---

## 🔥 Streaks

Streaks encourage consistent daily progress.

Nook stores:

```text
currentStreak
longestStreak
```

Streak logic is centralized in:

```text
src/lib/streak.ts
```

---

# 🛍️ Nook Shop

The shop catalog is defined in:

```text
src/lib/shop.ts
```

When a player purchases an item:

```text
User selects item
       ↓
Server verifies session
       ↓
Server checks item
       ↓
Server checks Ember balance
       ↓
Server validates item price
       ↓
Purchase saved to database
       ↓
Embers deducted
       ↓
Item added to inventory
```

This keeps the in-game economy under server control.

---

# 🔑 Authentication

Authentication is implemented using **NextAuth.js** with a credentials provider.

Passwords are hashed using **bcrypt** before being stored.

Sessions use JWT-based authentication.

Protected API routes retrieve the authenticated user's session and use the session's `userId` when accessing database records.

This prevents users from accessing or modifying another user's tasks, progression, or inventory.

---

# ⚡ Optimistic UI

Nook uses optimistic updates to make the interface feel responsive.

For example, when completing a task:

```text
User clicks "Complete"
        ↓
UI updates immediately
        ↓
API request
        ↓
Server validates request
        ↓
Rewards calculated
        ↓
Database updated
        ↓
UI synchronized
```

If the request fails:

```text
API request fails
       ↓
Local state rolled back
       ↓
Error toast displayed
```

This provides a fast user experience without trusting the client for game progression.

---

# 📱 Responsive & Accessible

Nook is designed for both desktop and mobile devices.

### Responsive design

The dashboard uses a two-pane layout on larger screens and collapses into a single-column layout on smaller screens.

### Accessibility

The application uses semantic controls including:

```html
<button>
<input>
<select>
```

It also provides:

* Visible focus states
* Form labels
* Keyboard-friendly controls
* `aria-live` notifications
* Loading states
* Error states
* Retry states
* Responsive layouts

---

# 🌐 Production Deployment

SQLite is convenient for local development but its filesystem is not suitable for typical serverless deployments.

For production, Nook uses PostgreSQL.

Recommended PostgreSQL providers include:

* Supabase
* Neon

---

## Deploying with Vercel

### 1. Create a PostgreSQL database

Create a PostgreSQL project with Supabase, Neon, or another PostgreSQL provider.

Obtain:

```text
DATABASE_URL
DIRECT_URL
```

---

### 2. Configure Prisma

Make sure `prisma/schema.prisma` contains:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

### 3. Push the schema

```bash
npx prisma db push
```

---

### 4. Push the repository to GitHub

```bash
git add .
git commit -m "Initial Nook release"
git push
```

---

### 5. Import the repository into Vercel

Create a new Vercel project and import the GitHub repository.

Configure these environment variables:

```text
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

Set `NEXTAUTH_URL` to your deployed application URL:

```text
https://your-app.vercel.app
```

---

### 6. Deploy

Vercel will build and deploy the Next.js application.

After deployment, open the production URL and verify that authentication, task management, progression, and the shop work correctly.

---

# 🧪 Production Verification

Before submitting the project, test the live deployment using an incognito/private browser window.

Recommended flow:

```text
Open live application
        ↓
Create account
        ↓
Log in
        ↓
Create a task
        ↓
Complete the task
        ↓
Verify XP / Embers / attribute changes
        ↓
Check streak or level-up feedback
        ↓
Refresh the page
        ↓
Confirm progress persists
        ↓
Purchase a Nook item
        ↓
Confirm item appears in the room
```

Refreshing the page verifies that progression is persisted in the database rather than existing only in local client state.

---

# 🎥 Walkthrough Video

For the project submission, record a **90–180 second walkthrough** demonstrating the main functionality.

Recommended walkthrough:

### 1. Sign up

Create a new account.

### 2. Add a task

Create a task and show its difficulty and attribute.

### 3. Complete the task

Complete the task and demonstrate:

* XP reward
* Embers
* Attribute growth
* Streak update
* Level-up notification, if applicable

### 4. Refresh

Refresh the page and show that the progress is still present.

### 5. Visit the Nook

Open the shop and purchase a decorative item using earned Embers.

### Video requirements

* Duration: **90–180 seconds**
* File size: **under 100 MB**
* No login wall for viewing

The video can be hosted as an **unlisted YouTube video** or included in the repository under:

```text
/docs
```

---

# 📋 Submission Checklist

Before submitting Nook:

* [ ] Application runs locally
* [ ] Registration works
* [ ] Login works
* [ ] Authentication is protected
* [ ] Tasks can be created
* [ ] Tasks can be edited
* [ ] Tasks can be completed
* [ ] Tasks can be deleted
* [ ] XP is calculated server-side
* [ ] Embers are calculated server-side
* [ ] Attributes increase correctly
* [ ] Leveling works
* [ ] Streaks work
* [ ] Shop purchases work
* [ ] Room items persist
* [ ] API routes enforce user ownership
* [ ] Optimistic updates work
* [ ] Failed requests roll back correctly
* [ ] Loading states work
* [ ] Error states work
* [ ] Mobile layout works
* [ ] Accessibility requirements are satisfied
* [ ] `.env` is excluded from Git
* [ ] No secrets are committed
* [ ] Git history contains incremental commits
* [ ] Repository is public
* [ ] Production database is configured
* [ ] Live deployment works
* [ ] Live deployment works in an incognito window
* [ ] Walkthrough video is recorded
* [ ] Walkthrough video is accessible without a login wall

---

# 🧑‍💻 Useful Commands

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Push Prisma schema

```bash
npx prisma db push
```

### Create a Prisma migration

```bash
npx prisma migrate dev --name <migration-name>
```

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │                     │
                    │   Next.js UI        │
                    │   React Components  │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │   Next.js API       │
                    │      Routes         │
                    │                     │
                    │ Session Validation  │
                    │ Authorization       │
                    │ Reward Calculation  │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               │ Prisma
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │                     │
                    │ User                │
                    │ Task                │
                    │ InventoryItem       │
                    └─────────────────────┘
```

---

# 🎨 Design Philosophy

Nook is built around the idea that productivity does not have to feel like a productivity app.

Instead of simply showing a list of unfinished tasks, Nook turns everyday work into visible character progression.

```text
Complete a task
      ↓
Earn XP
      ↓
Grow an attribute
      ↓
Build your streak
      ↓
Earn Embers
      ↓
Decorate your Nook
```

Your productivity becomes something you can **see, grow, and personalize**.

---

# 🚧 Future Improvements

Potential future features include:

* More furniture and room layouts
* Character customization
* More task categories
* Daily quests
* Achievements
* More progression systems
* Sound effects and ambient music
* Seasonal room decorations
* Friend/social features
* Additional RPG mechanics
* Advanced productivity statistics

---

# 📄 License

This project is currently available for educational and portfolio purposes.

Add a formal license such as the **MIT License** if you want others to freely use, modify, and distribute the project.

---

# 🌙 Nook

> **Do the work. Grow your character. Build your Nook.**

Made with ☕, 🌱, and a little late-night motivation.
