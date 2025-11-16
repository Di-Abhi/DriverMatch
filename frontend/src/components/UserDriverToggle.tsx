import React, { FC, useState } from 'react';

// Define the accent colors for consistency
const ACCENT_COLOR = 'teal-600'; 

interface UserDriverToggleProps {
  // Optional prop to lift the selection state up to a parent component
  onToggle?: (role: 'user' | 'driver') => void;
}

const UserDriverToggle: FC<UserDriverToggleProps> = ({ onToggle }) => {
  // State to track the active role. Default is 'user'.
  const [activeRole, setActiveRole] = useState<'user' | 'driver'>('user');

  const handleToggle = (role: 'user' | 'driver') => {
    setActiveRole(role);
    if (onToggle) {
      onToggle(role);
    }
  };

  // Helper function to determine button styles
  const getButtonClasses = (role: 'user' | 'driver') => {
    const isActive = activeRole === role;
    
    return `
      w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out
      ${isActive
        ? `bg-green-400 text-white shadow-md` 
        : `bg-gray-100 text-gray-700 hover:text-${ACCENT_COLOR}`
      }
    `;
  };

  return (
    <div className="flex justify-center p-2">
      <div
        className="w-full max-w-xs bg-gray-100 p-1 rounded-xl shadow-inner flex"
        role="radiogroup"
        aria-label="Select Account Type"
      >
        <button
          type="button"
          onClick={() => handleToggle('user')}
          className={getButtonClasses('user')}
          aria-checked={activeRole === 'user'}
          role="radio"
        >
          I'm a Rider
        </button>
        
        <button
          type="button"
          onClick={() => handleToggle('driver')}
          className={getButtonClasses('driver')}
          aria-checked={activeRole === 'driver'}
          role="radio"
        >
          I'm a Driver
        </button>
      </div>
    </div>
  );
};

export default UserDriverToggle;