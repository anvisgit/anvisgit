## Project Layout Translations

This folder contains the translations used by **project-specific layout pages**.

Translations are **automatically resolved using the project identifier (slug)**.  
For this reason, the translation file **must have the same name as the project slug**.

### File naming

`<project-slug>.json`

### Required format

Each translation file must follow this structure:

```json
{
  "fr": {
    "key": "text"
  },
  "en": {
    "key": "text"
  }
}
```

## Project Pages Layout Translations

If a project have additional pages, the page's translations must **follow the same format as before**.

To be automatically resolved, the translation file must be named as follow :

`<project-slug>-<page-slug>.json`
