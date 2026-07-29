# slpregnancy — Claude Instructions

## Repo structure

This repo has two branches that must be kept in sync:

| Branch | What it is | Root path |
|--------|-----------|-----------|
| `main` | Expo/React Native app (iOS, Android, Web) | `/` |
| `admin` | Next.js admin dashboard | `admin/` |

Shared logic lives in `services/`, `data/`, `theme/`, `lib/`, `supabase/` on the `main` branch.

## Rule: always update all three surfaces

Every change must be applied across **all three surfaces** when relevant:

1. **Expo app** (`main` branch) — `app/`, `components/`, `services/`, `store/`, `lib/`, `data/`, `theme/`
2. **Admin app** (`admin` branch) — `admin/app/`, `admin/components/`, `admin/lib/`
3. **Shared code** — `data/`, `supabase/`, `services/`, `theme/`

Never update one surface without checking whether the others need the same change. If a data model, Supabase schema, or shared type changes, all surfaces must reflect it.

## Rule: logical commit groups

- Commit related changes together, unrelated changes separately
- Each commit message must describe the *why*, not just the *what*
- When a change spans both branches, commit to each branch separately with parallel messages (e.g. `feat: add trimester field to protocols` on both `main` and `admin`)

## Git identity

All commits must use:
- **Name:** `louislndr`
- **Email:** `landreaulouis1@icloud.com`

This is already set in the local repo config — do not override it.

## Supabase

Supabase client is initialized in `lib/supabase.ts` (Expo) and `admin/lib/supabase.ts` (admin). Any schema changes must be reflected in both.

## No unnecessary abstraction

- Fix the root cause, not the symptom
- Minimal code impact per change
- No premature abstractions — three similar lines is fine
