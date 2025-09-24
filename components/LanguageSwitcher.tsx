import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'id', name: t('languages.id'), flag: '🇮🇩' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: languageCode });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 rounded-md hover:bg-muted/50"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white border border-border/50 rounded-lg shadow-lg z-50 py-1"
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors duration-200 flex items-center gap-3 ${
                language.code === i18n.language ? 'bg-muted/30 text-primary font-medium' : 'text-muted-foreground'
              }`}
              role="option"
              aria-selected={language.code === i18n.language}
            >
              <span className="text-base">{language.flag}</span>
              <span>{language.name}</span>
              {language.code === i18n.language && (
                <div className="ml-auto w-2 h-2 bg-accent rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}