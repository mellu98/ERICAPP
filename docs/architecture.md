# Architecture Overview

## Product Thesis

This app is a family wellness monitoring and support product for caregivers who want to keep track of the well-being of loved ones. It is **not** a medical device, does **not** diagnose, and does **not** replace doctors, emergency services, or clinical advice.

The core value is:
- simple check-ins
- visible trends over time
- shared family context
- reminders and follow-up
- clear escalation when something looks concerning

## MVP

The first version should solve one job very well: let a caregiver create a private family space and track a few wellness signals for each person.

Minimum features:
- account creation and secure sign-in
- family space creation
- invite/collaborator access for relatives or trusted caregivers
- person profile for each family member
- daily or weekly check-ins with a small set of wellness inputs
- timeline of observations and notes
- simple trend cards and status indicators
- reminders for check-ins
- escalation banner when a user selects a severe or concerning input
- export/share summary for a family handoff or a professional visit

Suggested check-in inputs:
- mood
- energy
- sleep quality
- appetite
- pain or discomfort, as a self-reported note
- temperature only if the user manually enters it
- free-text notes

Keep the MVP focused on observation, not diagnosis.

## Recommended Stack

Recommended delivery path: **Expo + React Native with web support** for a single codebase, paired with a small TypeScript backend.

Why this path:
- one codebase covers iOS, Android, and web
- app-store readiness is simpler than a pure wrapper approach
- mobile UX, notifications, and offline-first behavior are easier to grow into
- the web target works for caregivers who prefer desktop

Frontend:
- Expo SDK
- React Native
- Expo Router
- TypeScript
- TanStack Query for server state
- Zustand or lightweight context for local UI state
- React Hook Form for input flows
- Zod for validation

Backend:
- Node.js with TypeScript
- Fastify or NestJS
- PostgreSQL
- Prisma
- Redis for background jobs and reminders
- object storage for attachments if needed

Platform services:
- auth with a managed provider or a well-scoped custom auth layer
- push notifications through Expo push plus APNS/FCM
- email notifications for invite and reminder flows
- analytics and crash reporting before beta

## Target Module Map

Frontend module map:
- `app/` for routes and navigation
- `features/household/` for family spaces and invites
- `features/person/` for profiles and shared context
- `features/checkin/` for daily inputs and note capture
- `features/timeline/` for history and activity views
- `features/insights/` for trend cards and summaries
- `features/reminders/` for notification settings and scheduling
- `features/escalation/` for warning states and next steps
- `components/ui/` for shared controls
- `lib/api/` for server calls
- `lib/auth/` for session handling
- `lib/validation/` for schemas and form rules

Backend module map:
- `auth/` for identity and session verification
- `households/` for family spaces and membership
- `people/` for dependent profiles and relationship metadata
- `checkins/` for daily entries and observation history
- `metrics/` for normalized wellness signals
- `alerts/` for threshold rules and warning logic
- `reminders/` for scheduled nudges
- `summaries/` for generated snapshots and exports
- `notifications/` for push, email, and in-app delivery
- `audit/` for consent, sharing, and access logs
- `files/` for attachments and uploads
- `jobs/` for background processing

## High-Level Data Model

Core entities:
- `User`: signed-in account owner or caregiver
- `Household`: private family space
- `HouseholdMember`: membership record linking a user to a household
- `PersonProfile`: the family member being monitored
- `ConsentRecord`: who can view or edit what
- `CheckIn`: one wellness entry at a point in time
- `MetricEntry`: normalized values inside a check-in
- `CareNote`: free-text notes or context
- `ReminderRule`: schedule for nudges
- `AlertRule`: threshold or condition that triggers a warning
- `EscalationEvent`: record of a concerning state and what the app suggested
- `SummarySnapshot`: shareable overview for handoff
- `NotificationLog`: delivery history
- `Attachment`: optional files or images

Suggested relationships:
- one `User` belongs to one or more `Household`s
- one `Household` has many `PersonProfile`s
- one `PersonProfile` has many `CheckIn`s
- one `CheckIn` has many `MetricEntry` and `CareNote` records
- `AlertRule` belongs to a `PersonProfile` or `Household`
- `ConsentRecord` controls visibility per member and per profile
- `EscalationEvent` is created when a rule or manual input crosses a threshold

## Now / Next / Later

### Now

- set up the repo structure and base app shell
- implement auth, household creation, and person profile flows
- implement the first check-in form and timeline
- add basic alert logic and clear escalation copy
- put all sensitive logic behind server APIs

### Next

- add trend views and weekly summaries
- add reminders and push notifications
- add invite flows and role-based access
- add exportable handoff summaries
- add audit logs for access and sharing

### Later

- add richer analytics and longitudinal insights
- add attachment support for photos or documents
- add optional AI-generated summaries, always server-side and user-reviewable
- add offline sync and conflict resolution
- add monetization only after the core trust loop is stable

## Product Limits

This app must not:
- diagnose, treat, or claim to prevent disease
- interpret symptoms as medical conclusions
- replace emergency response when urgent symptoms appear
- tell users to ignore severe symptoms
- hide uncertainty in generated summaries

Hard-stop rules:
- if a user reports severe chest pain, trouble breathing, fainting, stroke-like symptoms, self-harm risk, or other emergency indicators, the app should stop normal guidance and show urgent escalation language
- if the user asks for diagnosis, the app should clearly refuse and redirect to a clinician or emergency service
- if the data is incomplete, the app should present uncertainty instead of pretending certainty

## Launch Prerequisites

Before beta or store submission:
- secure auth and session handling
- consent and sharing controls
- audit log for access to sensitive family data
- push notification reliability
- crash reporting and analytics
- privacy policy and clear product copy
- backup/restore story for user data

## Do Not Build Yet

Postpone these until the core monitoring loop is stable:
- AI diagnosis or treatment recommendations
- medication adjustment advice
- continuous sensor integrations
- emergency triage beyond generic escalation copy
- advanced subscription gating
- deep personalization without consent and data quality controls

## Final Recommendation

Start with an Expo-based single codebase and a small TypeScript backend. That gives the fastest path to a useful mobile/web product without locking us into a full rewrite or a fragile wrapper around a web app.
