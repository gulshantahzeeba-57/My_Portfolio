# Gulshan Tahzeeba — Portfolio Website

A static HTML/CSS/JS portfolio site with a dual **Portfolio Mode** (normal multi-page
site) and **Story Mode** (full-screen swipeable narrative), plus a built-in **Admin
Panel** for editing content without touching code.

---

## ⚠️ Read this first: how to actually open this site

**Do not open these HTML files by double-clicking them.** That loads the site as a
`file://...` URL, and browsers block or sandbox `localStorage` for pages opened that
way. Since the Admin Panel and dark/light mode both rely on `localStorage`, opening
the site this way is the #1 cause of "I added a project but it didn't save" or
"the site looks broken."

### Run it locally (takes 10 seconds)

Open a terminal in this folder and run one of these, then visit the printed address
in your browser:

```bash
# Python (most common, usually already installed)
python -m http.server
# then open http://localhost:8000

# Node.js
npx serve

# VS Code
# Install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

### Put it on real hosting (recommended for actually using it)

Drag-and-drop this whole folder onto any of these — all free, all take a couple of
minutes, and this local-server caveat goes away entirely:

- **Netlify** — [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel** — [vercel.com/new](https://vercel.com/new)
- **GitHub Pages** — push this folder to a GitHub repo, then enable Pages in the repo settings

---

## File structure

```
index.html          Home
about.html           About
education.html       Education
skills.html          Skills
projects.html        Projects
experience.html       Experience
contact.html          Contact
admin.html            Admin Panel (see below)

style.css             All site styling (plain CSS, no build step)
script.js             All site behavior — nav, theme toggle, lanyard, Story Mode,
                       the projects/education renderer, etc.
custom-cursor.js       The dot + ring cursor effect
content-apply.js       Applies any Admin-edited homepage/About/Contact text on load
projects-data.js       The default project list (seeds localStorage on first visit)

assets/                Images, the CV PDF, illustrations
```

There's no build step, no `npm install`, no framework — it's plain HTML/CSS/JS you
can open, edit, and re-save directly.

---

## The Admin Panel

Go to `admin.html` (there's also a small "Admin" link in every page's footer).

**Password:** `gulshan2026`
*(To change it: open `admin.html`, search for `ADMIN_PASSWORD`, and edit that one line.)*

From the Admin Panel you can:

- **Site Content** — edit the Home/About/Contact page text
- **Projects** — add, edit, or delete any project (including all the original ones —
  nothing is hardcoded anymore), with a Live URL, a separate GitHub URL, and an image
  from your computer or a web URL
- **Education** — add or delete timeline entries and certificates (with an optional
  image for each certificate)
- **Messages** — see messages submitted through the Contact form (only ones submitted
  in this same browser — see the note below)

### Important: how saving actually works here

This is a **static site with no server or database**. Everything you add or edit in
the Admin Panel is saved to **your current browser's local storage** — it shows up
immediately on the live pages in that same browser, but:

- It is **not visible to other visitors** or other devices — only you, in that
  browser, see your changes.
- Clearing your browser's site data/cache will erase it.
- If you use a different browser or a private/incognito window, you won't see your
  earlier changes there.

If you want a change to be permanent and visible to everyone, use the **"Export
edits (JSON)"** button on the Site Content tab, and either hand that file to a
developer to bake into the code, or ask for that to be done for you.

---

## Dark / Light mode

The toggle in the navbar (and in the Admin sidebar) switches themes and remembers
your choice for next time. Story Mode has its own light/dark treatment too — the
photo slides themselves always keep their built-in dark scrim for text readability
(that's about the photos, not the site theme), but everything else adapts.

## Story Mode

Click **"Story"** in the navbar for a full-screen, swipeable, Instagram/WhatsApp
Status–style walkthrough. It never opens automatically — Portfolio Mode (the normal
site) is always what visitors land on first.

## Custom cursor

On desktop/mouse devices you'll see a small dot + ring cursor instead of the default
arrow. It's automatically disabled on touch devices, so nothing needs to be done for
mobile.

---

## Known limitations (because this is a static site)

- **No real backend.** Admin edits, messages, and everything else live in
  `localStorage`, per-browser, as described above.
- **The Contact form** opens the visitor's own email app addressed to you (that's the
  actual delivery mechanism) and *also* saves a local copy into the Admin Messages
  tab in whichever browser it was submitted from.
- **Admin login is not real security** — it's a convenience gate to keep casual
  visitors out, not a way to protect sensitive data, since the password is visible in
  the page's source code.

If any of this ever needs to become "real" (a shared database, real authentication,
server-side email sending), that requires adding an actual backend — a good next
step would be a small hosted function (Netlify/Vercel Functions) plus a database like
Supabase or Firebase, but that's a separate project from this static site.
