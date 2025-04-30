import React from 'react';

export default function SubmitButton() {
  return (
    <div className="pt-4">
      <button
        type="submit"
        className="w-full py-2 px-4 bg-cyan-500 text-white font-semibold rounded-md shadow hover:bg-cyan-600 transition"
      >
        Submit Form
      </button>
    </div>
  );
}
