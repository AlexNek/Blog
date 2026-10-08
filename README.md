# Alex Nek — Blog

A bilingual (English / German) personal blog built with [DocFX](https://dotnet.github.io/docfx/) and hosted on GitHub Pages.

**Live site:** <https://alexnek.github.io/Blog/>

## Structure

```
docs/
├── content/
│   ├── en/            ← English content (served at site root)
│   │   ├── index.md
│   │   ├── about.md
│   │   └── posts/
│   │       └── YYYY-MM-DD-slug.md
│   └── de/            ← German content (served under /de/)
│       ├── index.md
│       ├── about.md
│       └── posts/
│           └── YYYY-MM-DD-slug.md
├── images/
│   └── favicon.svg
├── styles/
│   ├── main.css
│   └── main.js
└── docfx.json
```

- **English** posts live at the site root (`/Blog/posts/…`).
- **German** posts live under `/Blog/de/posts/…`.
- Translation pairs share the same date prefix (e.g. `2026-10-08-welcome.md` ↔ `2026-10-08-willkommen.md`).

## Adding a New Post

1. Create a date-prefixed Markdown file in **both** language folders:
   - `docs/content/en/posts/YYYY-MM-DD-slug.md`
   - `docs/content/de/posts/YYYY-MM-DD-slug.md`
2. Add YAML frontmatter to each file:
   ```yaml
   ---
   title: "Your Post Title"
   date: YYYY-MM-DD
   categories: [category1, category2]
   tags: [tag1, tag2]
   lang: en          # or de
   excerpt: "Optional override for the auto-extracted excerpt."
   ---
   ```
3. Include a language-switcher link to the counterpart post in the body.
4. Add the post to the corresponding `toc.yml`.
5. Run `./build.ps1` locally to verify, then commit and push.

## Building Locally

Prerequisites: [.NET SDK](https://dotnet.microsoft.com/download) (for the `dotnet` CLI).

```powershell
./build.ps1
```

The script will:
- Install the `docfx` global tool if not already present.
- Build the site to `docs/_site/`.
- Generate `posts-en.json`, `posts-de.json`, and `language-switcher.json`.

Open `docs/_site/index.html` in a browser to preview.

## Deployment

Pushes to `master` trigger the GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`), which builds the site and deploys it to the `gh-pages` branch.

After the first deploy, enable GitHub Pages:
1. Go to **Settings → Pages**.
2. Set Source to **"Deploy from a branch"**.
3. Select the `gh-pages` branch.

The site will be available at `https://alexnek.github.io/Blog/`.

You can also trigger a deploy manually via the **Run workflow** button on the Actions tab (`workflow_dispatch`).

## Custom Domain (Optional)

1. Copy `CNAME.example` to `CNAME` and set the value to your domain.
2. Configure your DNS provider to point to GitHub Pages.
3. See the [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## License

- **Code and build scripts** (everything outside `docs/content/`): MIT — see [LICENSE](LICENSE).
- **Blog text** (all posts and pages under `docs/content/`): © 2026 Alex Nek, all rights reserved. Quoting with reference/attribution (link back) is allowed; wholesale reuse is not.
