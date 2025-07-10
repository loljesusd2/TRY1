
'use client';

import { useState } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  id?: string;
}

export function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled = false, 
  size = 'md',
  label,
  id 
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      container: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {label && (
        <label 
          htmlFor={id}
          className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex items-center ${currentSize.container} 
          rounded-full transition-colors duration-200 ease-in-out focus:outline-none 
          focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : checked 
              ? 'bg-primary' 
              : 'bg-gray-300 hover:bg-gray-400'
          }
        `}
      >
        <span
          className={`
            ${currentSize.thumb} bg-white rounded-full shadow-sm transform transition-transform 
            duration-200 ease-in-out ${checked ? currentSize.translate : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
}
