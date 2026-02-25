'use client';

import React from 'react';

export function Toggle({
  enabled = false,
  onChange,
  size = 'md',
  label = '',
  description = '',
  disabled = false,
  className = '',
}) {
  const sizes = {
    sm: {
      toggle: 'w-8 h-4',
      dot: 'h-3 w-3',
      translate: 'translate-x-4',
    },
    md: {
      toggle: 'w-11 h-6',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      toggle: 'w-14 h-7',
      dot: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <p className="text-sm font-medium text-gray-800">{label}</p>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && onChange && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0
          ${sizeConfig.toggle}
          rounded-full
          border-2 border-transparent
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${enabled ? 'bg-green-500' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            ${enabled ? sizeConfig.translate : 'translate-x-0'}
            pointer-events-none inline-block
            ${sizeConfig.dot}
            transform rounded-full
            bg-white shadow-lg
            ring-0
            transition duration-300 ease-in-out
          `}
        />
      </button>
    </div>
  );
}

export function ToggleGroup({
  options = [],
  value,
  onChange,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div className={`inline-flex rounded-xl neo-inset p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange && onChange(option.value)}
          className={`
            ${sizeClasses[size]}
            rounded-lg font-medium
            transition-all duration-200
            ${value === option.value
              ? 'bg-green-500 text-white shadow-neo-button-active'
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Checkbox({
  checked = false,
  onChange,
  label = '',
  disabled = false,
  className = '',
}) {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-md
            transition-all duration-200
            ${checked
              ? 'bg-green-500 shadow-neo-button-active'
              : 'neo-inset'
            }
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {checked && (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
}

export function RadioButton({
  checked = false,
  onChange,
  label = '',
  name = '',
  value = '',
  disabled = false,
  className = '',
}) {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-full
            transition-all duration-200
            flex items-center justify-center
            ${checked
              ? 'bg-green-500'
              : 'neo-inset'
            }
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {checked && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
}

export default Toggle;
