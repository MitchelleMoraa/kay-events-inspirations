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
