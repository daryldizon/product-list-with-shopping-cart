import { ALL } from '../utils';

const InputSelect = ({ label, value, onChange, options, includeAll = false }) => (
  <label className="px-4">
    {label}:{' '}
    <select className="px-4 py-3 cursor-pointer" value={value} onChange={(e) => onChange(e.target.value)}>
      {includeAll && <option value={ALL}>{ALL}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default InputSelect;
