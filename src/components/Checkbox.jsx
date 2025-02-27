const Checkbox = ({ id, checked, onChange, error }) => (
  <div className="flex items-start flex-col">
    <div class="flex items-center">
      <input
        required
        id={id}
        type="checkbox"
        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        He leído y acepto la <a href="/politica-privacidad" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
      </label>
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Checkbox;
