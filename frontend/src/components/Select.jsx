import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ options, onChange, name }) {
  const id = useId();
  const [selected, setSelected] = useState(options[0]);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className='relative'>
      <select
        className='text-black w-full p-2 rounded-md border border-gray-300 appearance-none'
        name={name ? name : id}
        value={selected}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option
            default={option.id === 1}
            key={option.id}
            value={option.value ? option.value : option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-600'
      />
    </div>
  );
}
