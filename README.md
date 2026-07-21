# Bernie Portfolio

A simple, modern Next.js portfolio with sections for About, Experience, Education, Projects, and Tech Stack.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Edit the content

Most of the website text is in:

```txt
app/page.tsx
```

Change the arrays at the top of the file:

- `experiences`
- `education`
- `projects`
- `techGroups`

Update these placeholders before publishing:

- `your.email@example.com`
- `https://github.com/yourusername`
- `https://linkedin.com/in/yourusername`
- `/resume.pdf`

To add your resume, put a file named `resume.pdf` inside the `public` folder.

## Deploy

The easiest way is Vercel:

1. Push this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Deploy.
