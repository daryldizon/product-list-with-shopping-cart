const TONES = {
  dark: { field: 'bg-gray-300', button: 'bg-gray-300 hover:bg-gray-400' },
  light: { field: 'bg-gray-100', button: 'bg-gray-100 hover:bg-gray-300' },
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

import { useState } from 'react';

const NumberStepper = ({
  value,
  onChange,
  label,
  min = 1,
  max = Infinity,
  onBelowMin,
  tone = 'dark',
  symbols = ['−', '+'],
}) => {
  // Raw text while typing, so the field can be cleared before entering a new number.
  const [draft, setDraft] = useState(null);
  const { field, button } = TONES[tone];
  const buttonClass = `h-full w-20 text-2xl font-thin text-gray-600 hover:text-gray-700 ${button}`;
  const set = (n) => onChange(clamp(n, min, max));
  const decrement = () => (value > min ? set(value - 1) : onBelowMin?.());

  return (
    <div className="flex h-10 w-full mt-1">
      <button type="button" aria-label={`Decrease ${label}`} className={`${buttonClass} rounded-l`} onClick={decrement}>
        {symbols[0]}
      </button>
      <input
        type="number"
        aria-label={label}
        className={`w-10 text-center font-semibold text-gray-700 outline-none ${field}`}
        min={min}
        max={Number.isFinite(max) ? max : undefined}
        value={draft ?? value}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) set(n);
        }}
        onBlur={() => setDraft(null)}
      />
      <button type="button" aria-label={`Increase ${label}`} className={`${buttonClass} rounded-r`} onClick={() => set(value + 1)}>
        {symbols[1]}
      </button>
    </div>
  );
};

export default NumberStepper;
