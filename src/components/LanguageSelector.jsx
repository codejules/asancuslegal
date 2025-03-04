import { useState, useEffect, useRef } from 'preact/hooks';
import SpainFlag from '@/icons/SpainFlag';
import EnglishFlag from '@/icons/EnglishFlag';
import Arrow from '@/icons/Arrow';

const LanguageSwitcher = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine current and alternative locales
  const locales = [
    {
      code: 'es',
      name: 'ES',
      icon: SpainFlag,
      link: '/'
    },
    {
      code: 'en',
      name: 'EN',
      icon: EnglishFlag,
      link: '/en/'
    }
  ];

  const currentLocaleData = locales.find(locale => locale.code === currentLocale);
  const alternativeLocales = locales.filter(locale => locale.code !== currentLocale);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
    >
      <div className="group text-white rounded-md text-xs font-semibold bg-black/30 hover:bg-black/70 transition-all">
        <button
          type="button"
          className="cursor-pointer grid grid-cols-3 items-center gap-2 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <currentLocaleData.icon className="w-4 h-4 mr-2" />
          {currentLocaleData.name}
          <Arrow
            className={`-mr-1 h-5 w-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <ul className="absolute w-full pt-0.5 animate-fade-down animate-duration-200 z-10">
            {alternativeLocales.map((locale) => (
              <li key={locale.code} className="py-[2px]">
                <a
                  href={locale.link}
                  className="rounded-md bg-black/30 hover:bg-black/70 grid grid-cols-3 items-center gap-2 p-2"
                >
                  <locale.icon className="w-4 h-4 mr-2" />
                  {locale.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;