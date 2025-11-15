// src/components/DriverCard.jsx
import React from 'react';

export default function DriverCard({ d, onContact }){
  return (
    <div className="border rounded p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">{d.name}</div>
        <div className="text-sm text-gray-500">{d.vehicleType} • {d.experienceYears ?? 0} yrs</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onContact && onContact(d)} className="px-3 py-1 rounded bg-indigo-600 text-white">Contact</button>
      </div>
    </div>
  );
}
