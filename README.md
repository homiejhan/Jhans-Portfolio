# Justin Han — Portfolio

Personal portfolio site. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Repo structure

```
Jhans-Portfolio/
├── index.html          ← About Me page (homepage)
├── coursework.html     ← Coursework page with sort/filter
├── photo.png           ← Profile photo
├── assets/
│   ├── css/
│   │   └── main.css        ← ALL styles (shared across every page)
│   └── js/
│       ├── courses.js      ← Course data array (add new courses here)
│       └── coursework.js   ← Sort, filter, and render logic
└── courses/
    ├── TEMPLATE.html       ← Blank template for new course pages
    ├── ece-445s.html       ← ECE 445S Real-Time DSP Lab (fully filled in)
    └── ... (other course stubs)
```

> **Important:** The `assets/` folder must be committed and pushed alongside
> `index.html` and `coursework.html`. If only the HTML files are pushed,
> the pages will load without any styles or interactivity.

## How to add a course

1. Open `assets/js/courses.js`
2. Add a new entry to the `courses` array following the existing format:
   ```js
   { slug:'ece-999', code:'ECE 999', title:'Course Name', semester:'Fall 2026',
     semOrder:8, desc:'Short description.', tags:['Tag1','Tag2'] },
   ```
3. Copy `courses/TEMPLATE.html` → `courses/ece-999.html` and fill it in.
4. Push everything — the course card will appear automatically on the coursework page.

## How to update a course detail page

Open the relevant file in `courses/` and edit the HTML directly.
Each page is self-contained (inline styles and scripts) so it works
independently without needing the `assets/` folder.

## GitHub Pages

Go to **Settings → Pages**, set source to the `main` branch root.
Your site will be live at `https://homiejhan.github.io/Jhans-Portfolio`.
