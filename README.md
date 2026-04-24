# Agnos Patient Realtime Form

> A production-quality, real-time patient input form and staff monitoring system built as a front-end developer candidate assignment for Agnos.

## Live Demo

> **TODO:** Replace with deployed URL once deployed to Vercel/Netlify.

| View | URL |
|---|---|
| Landing | `https://your-deployment.vercel.app/` |
| Patient Form | `https://your-deployment.vercel.app/patient?sessionId=demo` |
| Staff Dashboard | `https://your-deployment.vercel.app/staff?sessionId=demo` |

## Screenshots

Open both views side-by-side for the full demo experience:

```
Patient Form (/patient)          Staff Dashboard (/staff)
┌─────────────────────┐          ┌─────────────────────┐
│ Personal Info  [1]  │  ──────▶ │ Live Patient Data   │
│ Contact Info   [2]  │          │ ● Patient is typing  │
│ Additional     [3]  │          │ First Name: John     │
│ Emergency      [4]  │          │ Last Name:  Smith    │
└─────────────────────┘          └─────────────────────┘
```

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Production-grade, Vercel-native, strict typing |
| Styling | Tailwind CSS v4 | Utility-first, minimal runtime |
| Form management | React Hook Form + Zod | Schema-based validation, performant, type-safe |
| Real-time | **Ably** | Managed WebSocket pub/sub, serverless-compatible, free tier |
| Icons | Lucide React | Lightweight, consistent icon set |
| Date utilities | date-fns | Tree-shakeable, functional date formatting |

---

## Features

### Patient Form
- All required fields: name, DOB, gender, phone, email, address, language, nationality
- Optional fields: middle name, religion, emergency contact
- Schema-based Zod validation with user-friendly error messages
- Required fields marked with `*`
- Email format validation
- International phone number validation
- Form completion progress bar
- Organised into 4 logical sections
- Connection status indicator (Connected / Connecting / Offline)
- Sync status indicator (Typing… / Synced / Not synced)
- Success state after submission with reset option
- Mobile-first responsive design

### Staff Dashboard
- Real-time updates as patient types (no page refresh)
- Highlights the field currently being edited
- Shows patient activity status (typing / draft / submitted)
- Shows last updated time
- Shows connection status
- Copy patient summary to clipboard
- Graceful empty state before any data arrives
- Reconnection banner on connection loss

### Real-time
- Debounced publish (300ms) to avoid flooding
- Events: `patient:update`, `patient:typing`, `patient:submit`, `patient:reset`
- Session-scoped channels (`?sessionId=demo` by default)
- Abstracted realtime layer — swap Ably for another provider by changing one file

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/agnos-patient-realtime-form.git
cd agnos-patient-realtime-form
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Ably API key (see [Environment Variables](#environment-variables) below).

### 4. Run locally

```bash
npm run dev
```

Open:
- **Landing page**: http://localhost:3000
- **Patient Form**: http://localhost:3000/patient?sessionId=demo
- **Staff Dashboard**: http://localhost:3000/staff?sessionId=demo

> **Tip:** Open the patient and staff URLs in two separate browser windows side-by-side.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_ABLY_API_KEY` | Yes | Ably API key with Publish + Subscribe capabilities |

### Getting an Ably API Key (free)

1. Sign up at [ably.com](https://ably.com) — no credit card required.
2. Create a new App from the dashboard.
3. Go to **API Keys** tab.
4. Copy the key that has **Publish** and **Subscribe** capabilities.
5. Paste into `.env.local`.

> **Security note:** The `NEXT_PUBLIC_` prefix exposes the key in the client bundle. This is acceptable for demo/assignment purposes. For production, use [Ably Token Authentication](https://ably.com/docs/auth/token) via a secure server endpoint to avoid exposing the root API key.

---

## How to Open Both Views

```bash
# Terminal 1 — start dev server
npm run dev

# Open in browser window 1
open http://localhost:3000/patient?sessionId=demo

# Open in browser window 2 (or a second monitor)
open http://localhost:3000/staff?sessionId=demo
```

Type in the patient form — you will see the staff dashboard update in real time.

---

## Real-time Synchronization Explanation

```
Patient Browser                   Ably Cloud                  Staff Browser
     │                                │                               │
     │  type in field (debounce 300ms)│                               │
     │──publish(patient:update)──────▶│                               │
     │                                │──push(patient:update)────────▶│
     │                                │                               │ update UI
     │  focus a field                 │                               │
     │──publish(patient:typing)──────▶│                               │
     │                                │──push(patient:typing)────────▶│
     │                                │                               │ highlight field
     │  submit form                   │                               │
     │──publish(patient:submit)──────▶│                               │
     │                                │──push(patient:submit)────────▶│
     │                                │                               │ show submitted banner
     │  reset form                    │                               │
     │──publish(patient:reset)───────▶│                               │
     │                                │──push(patient:reset)─────────▶│
     │                                │                               │ clear data
```

**Channel naming:** Each session uses a dedicated Ably channel: `agnos-patient:{sessionId}`.
The default session is `demo`. Multiple patient/staff pairs can run simultaneously using different `?sessionId=` query parameters.

**Debounce strategy:** Patient form changes are debounced at 300ms before publishing a `patient:update` event. This keeps the staff view feeling live while preventing flooding Ably with every keystroke.

**Typing events:** When the patient focuses a field, a `patient:typing` event is published immediately. These are not debounced. The staff view shows a typing indicator that auto-clears after 3 seconds of inactivity.

---

## Deployment Instructions

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_ABLY_API_KEY` → your Ably API key

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

Set `NEXT_PUBLIC_ABLY_API_KEY` in Netlify environment settings.

---

## Design Decisions

| Decision | Rationale |
|---|---|
| **Ably** for real-time | No persistent WebSocket server needed. Works seamlessly on Vercel/Netlify serverless. Free tier is sufficient for demo/assignment. |
| **Realtime abstraction** (`IRealtimeClient`) | UI components import only the interface. Swapping to Pusher/Supabase/Socket.io only requires replacing `realtimeClient.ts`. |
| **Debounce 300ms** | Balances responsiveness (staff sees near-instant updates) with efficiency (avoids flooding on every keystroke). |
| **Session ID via query param** | Allows multiple isolated demo sessions without a database. Easy to test. |
| **React Hook Form + Zod** | RHF for performant uncontrolled inputs; Zod for co-located, type-safe validation separated from UI. |
| **`usePatientForm` hook** | All form logic (watch, debounce, publish, submit, reset) in one hook. `PatientForm.tsx` is purely presentational. |
| **Singleton client** | `getRealtimeClient()` returns a singleton to avoid duplicate Ably connections across React re-renders and hot-reloads. |
| **`NEXT_PUBLIC_` API key** | Acceptable for front-end assignment. Production would use Ably Token Authentication. |

---

## Trade-offs & Known Limitations

- **No persistence:** Data is not stored in a database. If both browser tabs are closed, state is lost. A future version would persist to Supabase or similar.
- **API key in client bundle:** Acceptable for demo; production should use token auth.
- **Single staff viewer:** The current design assumes one staff member per session. Multiple staff tabs work fine (all subscribe to the same channel), but there is no staff authentication.
- **No message history:** Ably does not replay past messages by default. If staff opens the dashboard after the patient has already started, they will see no data until the patient types again. This can be solved with Ably's [rewind](https://ably.com/docs/channels#channel-rewind) feature in production.

---

## Future Improvements

- [ ] Ably Token Authentication for secure production deployment
- [ ] Database persistence (Supabase / PlanetScale) for session history
- [ ] Message rewind so staff can see data even if they connect late
- [ ] Staff authentication / login
- [ ] Multi-patient session management on staff dashboard
- [ ] Print-friendly patient summary
- [ ] Internationalisation (i18n) for form labels
- [ ] Dark mode
- [ ] Unit tests for validation schema and hooks
- [ ] E2E tests (Playwright) for form submit → staff view update flow
