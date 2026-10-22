<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- The first account to sign up gets the admin (owner) role via a database trigger; all owner writes are gated by `has_role` in RLS — keeps privileges out of client code.
- Inspiration photos live in a private storage bucket and are stored as long-lived signed URLs — the workspace blocks public buckets.
- Inspiration PDFs are generated in the browser with jsPDF — no server needed for downloads.
- Inspiration galleries keep the cover in `image_url` and extra photos in `additional_image_urls`; editing appends uploads to retained photos so older single-photo inspirations remain compatible.

- Shared brand and breadcrumbs render through the root shell; informational pages use distinct public routes so navigation and page metadata stay consistent.
- Admin sign-in lives at `/login`, with the existing role-gated management screen at `/admin`; footer access replaces main navigation access without changing database authorization.
- Inspiration guest counts are nullable positive integers, shared by owner forms, visitor cards, booking defaults and PDF exports; unknown counts must not be fabricated.
