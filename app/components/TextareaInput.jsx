import React from 'react';

export default function TextareaInput({ id, label, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <textarea
        name={id}
        id={id}
        rows="4"
        className="mt-1 block w-full rounded-md bg-white/10 text-white border border-white/20 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 placeholder-slate-400"
        placeholder={placeholder}
      />
    </div>
  );
}
