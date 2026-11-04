# Sergio Herrera Castro | e-Portfolio

Static site (HTML, CSS, JavaScript): no build step. Open `index.html` in a browser to preview.

## Edit the text

All text, in English, French and Spanish, is in [`assets/js/content.js`](assets/js/content.js).

- Text that starts with `TODO:` appears on the site as a dashed "To complete" box.
  Replace the whole string with your own words and remove the `TODO:` prefix.
- Values in `[ ]` are lists; each item becomes a tag.

## Add images

Put these files in `assets/img/`. Until a file exists, the site shows a placeholder.

| File | Where it appears |
|------|------------------|
| `profile.jpg` | Welcome (portrait, 4:5) |
| `project-turbofan.jpg` | Projects (16:10) |
| `project-aire.jpg` | Projects (16:10) |
| `project-positioner.jpg` | Projects (16:10) |
| `sport.jpg` | Sport & other activities (16:10) |

## Publish on GitHub Pages

1. Create a repository on GitHub (for example `portfolio`, or `<your-username>.github.io` for a root URL).
2. Upload the contents of this folder. The `.gitignore` keeps the CV and LinkedIn PDFs out of the repository.
3. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
4. The site appears at `https://<your-username>.github.io/<repository>/` after a minute or two.

Each tab has its own link, for example `.../#projects` or `.../#career`.
