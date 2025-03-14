import { getI18N } from "@/i18n";

const Checkbox = ({ dataLocale: currentLocale, id, checked, onChange, error }) => {
  const i18n = getI18N({ currentLocale });

  return (
    <div className="flex items-start flex-col">
      <div class="flex items-center">
        <input
          name="checkbox"
          required
          id={id}
          type="checkbox"
          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
          checked={checked}
          onChange={onChange}
        />
        <label for={id} htmlFor={id} className="ms-2 text-sm font-medium text-gray-300">
        {i18n.ACCEPT_PRIVACY_POLICY.title} <a href={i18n.ACCEPT_PRIVACY_POLICY.url} className="text-blue-200 hover:underline" rel="noopener noreferrer">{i18n.ACCEPT_PRIVACY_POLICY.subtitle}</a>
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
};

export default Checkbox;
