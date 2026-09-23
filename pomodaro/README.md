# Tomato. 🍅

A pomodoro timer styled like a retro kitchen appliance, with a GitHub-style
monthly "contribution" grid tracking how many focus sessions you've logged
each day.

No build step, no dependencies, no backend — just `index.html`, `styles.css`,
and `script.js`. Everything is saved to `localStorage`, so your record lives
in your own browser.

## Features

- **Focus / short break / long break** modes with a circular dial that
  drains as time passes
- Configurable durations and how many focus sessions happen before a long
  break
- A soft two-tone chime when a session ends (generated in-browser, no audio
  files)
- **Monthly record**: a heatmap of daily focus sessions, styled after
  GitHub's contribution graph, with month navigation
- Everything persists locally — refresh or close the tab and your history
  stays put

## Running it

Just open `index.html` in a browser. That's it.

To serve it locally instead (useful for some browsers' storage rules):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Putting it on GitHub

```bash
git init
git add .
git commit -m "Tomato: a pomodoro timer with a monthly record"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Hosting it for free with GitHub Pages

1. Push the repo (above).
2. On GitHub: **Settings → Pages → Source → Deploy from a branch**, pick
   `main` and `/ (root)`.
3. Your timer will be live at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

## File structure

```
tomato-timer/
├── index.html    # markup
├── styles.css    # kitchen-appliance theme
├── script.js     # timer logic + localStorage record-keeping
└── README.md
```

## Ideas to extend it

- Export the monthly record as CSV
- Desktop notifications when a session ends (`Notification` API)
- A yearly view, GitHub-style, instead of month-by-month
- Sync the record across devices with a tiny backend or a service like
  Supabase

## Demo:
