# Client Content Editing (CloudCannon)

This site is connected to **CloudCannon** so the client can edit text, images and
video directly in a visual editor without touching code.

## One-time setup (you, the developer)
1. Create a free account at https://cloudcannon.com and connect this GitHub repo.
2. CloudCannon will detect `cloudcannon.config.yml` and build the site.
3. In CloudCannon, open **Site Settings → Visual Editor** and confirm HTML files are editable.
4. Invite the client as an **Editor** (email invite) with "Editor" role (no code access).

## How the client edits
- Log in to CloudCannon → open the site → click **Visual Editor**.
- Click any yellow-outlined text or image to edit it in place.
- Images: click an image → "Replace" → upload a new file (stored in `assets/`).
- Save → CloudCannon commits the change to GitHub → Vercel redeploys automatically.

## What is editable
- All `<img>` elements (photo swap) — marked `class="editable"`.
- Headings (`h1/h2/h3`) and paragraphs (`p`) on the homepage — marked `class="editable"`.
- Generated menu/experience pages: title, summary and hero image are editable
  (regenerate via `node site/generate.mjs` after data changes).

## Adding video
The site currently has no video elements. To add a video the client can replace,
insert an `<video>` (or `<iframe>` for YouTube/Vimeo) tag and mark it editable,
or store the video URL in a data file and reference it.

## Notes
- `class="editable"` is CloudCannon's legacy inline-editing method. It still works
  and is the only option for plain static HTML without a templating engine.
- For richer editing (arrays, components), migrate to a static site generator
  (e.g. Eleventy) with Liquid templates and CloudCannon's modern Editable Regions.
- Form fields, navigation and footer are intentionally left non-editable to
  protect layout.
