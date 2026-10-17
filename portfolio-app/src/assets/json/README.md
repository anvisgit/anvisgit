# Portfolio Projects Data

This JSON file defines the **structure and content of the portfolio projects**.

It contains:

- project **categories**
- individual **projects**
- localized content (**French / English**)
- assets such as **images, thumbnails, tags, and links**
- optional **custom layout components**

The file is used by the application to dynamically generate the portfolio interface.

---

## File Structure

The root object contains **one entry per supported language**.

```json
{
  "fr": { ... },
  "en": { ... }
}
```

---

## Project Structure

Each project entry follows this structure:

```json
{
  "slug": "short_project_id",
  "name": "Name of the project",
  "tags": ["Example", "example.svg"],
  "description": "Description displayed when hovering the project planet",
  "images": ["Example.jpeg", "Example2.jpeg"],
  "carousel": [],
  "displaytext": "@ExampleLayout",
  "thumbnails": ["Example.jpeg"],
  "pages": [
    {
      "slug": "short_page_id",
      "title": "The title of the page",
      "content": "@ExampleLayout"
    }
  ],
  "techstack": [
    {
      "thumbnail": "exemple.svg",
      "name": "Name of the technology"
    }
  ],
  "libraries": [
    {
      "thumbnail": "logo.png",
      "name": "Name of the librairie",
      "url": "link"
    }
  ],
  "endlinks": [
    {
      "thumbnail": "example.svg",
      "url": "link"
    }
  ]
}
```

---

## Fields Description

### `slug`

Unique identifier for the project.

---

### `name`

Displayed project title.

---

### `tags`

Tags displayed at the **top of the project page**.

- If the tag ends with an image format (`.png`, `.svg`, `.webp`), the image will be loaded from:

```
public/tags/
```

- Otherwise, the tag is displayed as plain text.

---

### `description`

Short description shown when the user **hovers the project planet**.

---

### `images`

Images displayed inside the project content container.

They must exist in:

```
public/project_images/<category>/<slug>/
```

Example:

```
public/project_images/games/plantgenerator/
```

---

### `carousel`

Optional image carousel displayed in the project container.

Images must also exist in:

```
public/project_images/<category>/<slug>/
```

---

### `displaytext`

Defines the **main content of the project page**.

Two possible formats:

**HTML content**

```
"displaytext": "<p>Project description...</p>"
```

**Custom layout component**

```
"displaytext": "@ExampleLayout"
```

The `@` prefix indicates a Vue component located in:

```
components/projectPages/
```

---

### `thumbnails`

Array of images displayed in project's page. The first one shows when hovering the project planet.

Must be located in:

```
public/project_images/<category>/<slug>/
```

---

### `pages`

Optional subpages of the project.

Each page object contains:

```json
{
  "slug": "short_page_id",
  "title": "A title for the page",
  "content": "@ExampleLayout"
}
```

- `slug` : unique ID for the page
- `title` : name of the page
- `content` : content in html format for the page.

The `@` prefix indicates a Vue component located in:

```
components/projectPages/
```

---

### `techstack`

Array of technologies used in the project.

Each object contains:

- `thumbnail`: logo of the tech
- `name`: name of the technology
- `url`: optional link

---

### `libraries`

Array of external libraries used.

Each object contains:

- `thumbnail`: logo of the library
- `name`: library name
- `url`: official repository or website

---

### `endlinks`

External links displayed **at the end of the project page**.

Example:

```json
{
  "thumbnail": "github.svg",
  "url": "https://github.com/example/project"
}
```

Images are stored in:

```
public/link_images/
```

---

## Notes

- The `slug` must be **unique** across all projects.
- Images must exist in the correct asset folders.
- Layout components referenced with `@` must exist in `components/projectPages/`.
