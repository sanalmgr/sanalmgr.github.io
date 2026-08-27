# sanalmgr.github.io — JSON-driven academic website

This repository is a static GitHub Pages site. **All academic/profile content is stored in JSON files** and rendered by `assets/js/app.js`; `index.html` contains only the page structure and empty rendering targets.

## Content files

| File | What to edit |
|---|---|
| `data/site.json` | Bio, headline, links, metrics, documents, skills, navigation |
| `data/research.json` | Research vision, central question, research themes, modalities |
| `data/projects.json` | Research projects and project links |
| `data/publications.json` | Papers, preprints, venues, years, paper/code/data links |
| `data/career.json` | Work experience, education, awards, grants |
| `data/teaching.json` | Teaching philosophy, methods, experience, interests, mentoring |
| `data/service.json` | Reviewing, editorial roles, academic service, invited talks |
| `data/resources.json` | Programming tools and quality-assessment datasets |

## Add a publication

Add one object inside `data/publications.json` → `items`:

```json
{
  "year": 2026,
  "title": "Paper title",
  "authors": "Author A, Sana Alamgeer, Author B",
  "venue": "Venue name",
  "type": "journal",
  "links": [
    {"label": "Paper", "url": "https://..."},
    {"label": "Code", "url": "https://..."}
  ],
  "selected": False
}
```

Supported publication filters are generated automatically from each item's `type`, so a new type appears without editing JavaScript.

## Add a project

Add an object inside `data/projects.json` → `items`. The project grid is generated automatically.

## Local preview

Because browsers block `fetch()` from `file://`, use a local web server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

1. Push these files to the `main` branch of `sanalmgr/sanalmgr.github.io`.
2. In **Settings → Pages**, deploy from the `main` branch and repository root.
3. The site will be available at `https://sanalmgr.github.io/`.

No build tools, frameworks, npm packages, or Jekyll plugins are required.
