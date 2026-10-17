import translations from '@/assets/json/translations.json'

export type Translations = Record<string, Record<string, string>>
type JsonModule = { default: Translations }

//load data from json and translate to locale

export class LocalTranslator {
  public static locale = LocalTranslator.getLocale()

  //automatically retrieve all projects translations
  private static projectsTranslations = import.meta.glob(
    '@/assets/json/projectsTranslations/**/*.json',
    {
      eager: true,
    },
  ) as Record<string, JsonModule>
  private static projectTranslations: Record<string, Translations> = Object.fromEntries(
    Object.entries(this.projectsTranslations).map(([path, module]) => {
      const name = path.split('/').pop()!.replace('.json', '')
      return [name, module.default]
    }),
  )

  static getLocale(): string {
    const browserLocale = navigator.language.split('-')[0] // fr-FR -> fr

    if (browserLocale && browserLocale in translations) {
      return browserLocale
    }

    return 'en'
  }

  //Get localized text from translations json. Specifing projet slug will look for roject's specific translations
  public static getLT(key: string, slug?: string, secondarySlug?: string): string {
    const projectTranslation = slug
      ? this._getTranslationFromProjectSlug(slug, secondarySlug)
      : undefined

    const local =
      projectTranslation?.[this.locale]?.[key] ?? (translations as Translations)[this.locale]?.[key]

    const fallback = (translations as Translations)['en']?.[key]

    if (!local && !fallback) {
      //console.warn('[!] Missing translation:', key)
    } else if (!local && fallback) {
      console.warn('[!] Missing translation, falling back to "en" for:', key)
    }

    return local ?? fallback ?? key
  }

  private static _getTranslationFromProjectSlug(name?: string, secondaryName?: string) {
    if (!name) return
    if (secondaryName) return LocalTranslator.projectTranslations[`${name}-${secondaryName}`]
    return LocalTranslator.projectTranslations[name]
  }
}

// Translations
