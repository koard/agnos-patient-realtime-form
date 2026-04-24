# Development Planning Documentation

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (font, metadata)
│   ├── page.tsx              # Landing page → patient + staff links
│   ├── globals.css           # Tailwind v4 import + base styles
│   ├── patient/
│   │   └── page.tsx          # /patient route (reads ?sessionId)
│   └── staff/
│       └── page.tsx          # /staff route (reads ?sessionId)
│
├── components/
│   ├── forms/
│   │   ├── PatientForm.tsx   # Main form — assembles all sections
│   │   ├── FormSection.tsx   # Numbered section wrapper (card + header)
│   │   ├── FormField.tsx     # InputField, SelectField, TextareaField (RHF-connected)
│   │   └── FormProgress.tsx  # Progress bar for required field completion
│   ├── staff/
│   │   ├── StaffDashboard.tsx   # Top-level staff view
│   │   ├── PatientInfoCard.tsx  # Renders all patient fields with active highlights
│   │   └── StaffEmptyState.tsx  # Shown before any data arrives
│   └── shared/
│       ├── Card.tsx           # Base card surface
│       ├── Button.tsx         # Variants: primary / secondary / ghost / danger
│       ├── ConnectionStatus.tsx  # Pill badge for connection state
│       ├── SyncStatus.tsx        # Pill badge for save/sync state
│       └── PageHeader.tsx        # Sticky top header with brand + right slot
│
├── hooks/
│   ├── usePatientForm.ts      # Form logic: RHF, watch, debounce, publish, submit
│   ├── useRealtimePatient.ts  # Staff-side: subscribes to all patient events
│   └── useConnectionStatus.ts # Tracks Ably connection state
│
├── lib/
│   ├── realtime/
│   │   ├── realtimeClient.ts  # AblyRealtimeClient: concrete Ably implementation
│   │   └── realtimeTypes.ts   # IRealtimeClient interface + message shapes
│   ├── validation/
│   │   └── patientSchema.ts   # Zod schema + select option constants
│   └── utils/
│       ├── cn.ts              # clsx + tailwind-merge helper
│       └── formatDate.ts      # ISO → human-readable date helpers
│
└── types/
    └── patient.ts             # PatientFormData, ConnectionState, StaffViewState
```

---

## Design Decisions

### Desktop / Mobile Layouts

| Screen | Patient Form | Staff Dashboard |
|---|---|---|
| Mobile (< 640px) | Single-column fields, stacked sections | Stacked cards, full-width rows |
| Tablet (640–1024px) | Two-column grid inside each section | Two-column grid inside each section |
| Desktop (> 1024px) | Centred max-width container | Centred max-width container |

The 2-column grid is applied inside each `<FormSection>` using `grid grid-cols-1 sm:grid-cols-2`. Fields that need full width (e.g. Address textarea) use the `fullWidth` prop which adds `sm:col-span-2`.

---

## Component Architecture

```
PatientPage (server component)
  └─ PatientForm (client component)
       ├─ usePatientForm (hook) ← all form logic
       ├─ useConnectionStatus (hook)
       ├─ FormProvider (RHF context)
       ├─ FormProgress
       ├─ FormSection × 4
       │    └─ InputField / SelectField / TextareaField
       │         (each reads RHF context via useFormContext)
       └─ PageHeader, ConnectionStatus, SyncStatus, Button

StaffPage (server component)
  └─ StaffDashboard (client component)
       ├─ useRealtimePatient (hook) ← all realtime state
       ├─ PatientInfoCard
       │    └─ FieldRow × N
       ├─ StaffEmptyState (conditional)
       └─ PageHeader, ConnectionStatus, Button
```

### Why separate hooks from components?
- `usePatientForm` can be unit-tested independently without rendering any UI.
- `PatientForm` becomes a "dumb" layout component — easy to refactor or redesign.
- `useRealtimePatient` can be reused if a second staff view type is needed.

---

## Real-time Synchronization Flow

```
1. Patient page mounts
   → usePatientForm calls getRealtimeClient().connect("demo")
   → AblyRealtimeClient creates Ably.Realtime instance
   → subscribes to connection state changes

2. Patient types in a field
   → RHF watch() fires
   → setSyncStatus("typing")
   → debounceTimer resets (300ms)
   → after 300ms: publish("patient:update", { ...formValues, status: "draft" })
   → setSyncStatus("synced")

3. Ably delivers to staff browser
   → useRealtimePatient receives "patient:update"
   → setState: patientData = msg.payload, lastUpdated = msg.timestamp

4. Staff component re-renders
   → PatientInfoCard renders updated fields
   → FieldRow with matching activeField highlights in teal

5. Patient focuses a field
   → publish("patient:typing", { isTyping: true, field: "firstName" })
   → Staff sees "Patient is actively filling the form · firstName"

6. Patient submits
   → RHF handleSubmit → onSubmit
   → publish("patient:submit", { ...values, status: "submitted" })
   → PatientForm shows success state
   → Staff sees "Patient has submitted the form" banner

7. Patient resets
   → publish("patient:reset", { sessionId })
   → Staff state clears to null → StaffEmptyState shown
```

---

## Validation Strategy

Validation lives entirely in `src/lib/validation/patientSchema.ts`:
- Zod schema defines all rules.
- `zodResolver(patientFormSchema)` plugs into RHF.
- Individual field errors surface via `formState.errors` and are read by `FormField` components using a `getNestedError()` utility that handles dot-path names (e.g. `emergencyContact.name`).
- Validation mode is `onTouched` — fields are only validated after the user has interacted with them, reducing noise for first-time visitors.

---

## Known Limitations

1. **No message history (rewind):** If the staff view is opened after the patient has already typed, the staff sees no data until the next keystroke. Fix: enable Ably channel rewind (`rewind: 1`) in the channel options.

2. **API key in browser bundle:** Using `NEXT_PUBLIC_ABLY_API_KEY` for simplicity. Production requires Token Auth via a secure `/api/ably-token` endpoint.

3. **No persistence:** Closing both browser tabs loses all data. Requires a database for production.

4. **Singleton client assumption:** `getRealtimeClient()` returns one global instance. This works correctly in the current app but would need to be rethought if Next.js Server Components ever move client-side rendering patterns.

---

## Possible Future Improvements

| Improvement | Effort | Impact |
|---|---|---|
| Ably Token Auth | Medium | High — production security |
| Database persistence (Supabase) | High | High — data retention |
| Channel rewind for late-joining staff | Low | Medium — UX |
| Unit tests for hooks + schema | Medium | High — reliability |
| E2E tests (Playwright) | High | High — regression prevention |
| Staff authentication | High | High — security |
| Multi-patient session management | High | High — scalability |
| Dark mode | Low | Medium — UX polish |
| i18n form labels | Medium | Medium — accessibility |
| Print-friendly patient summary | Low | Low — convenience |
