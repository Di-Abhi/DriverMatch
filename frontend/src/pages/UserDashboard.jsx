import React, { useState, useEffect } from 'react';
import api from '../api/api';
import DriverCard from '../components/DriverCard';

export default function UserDashboard(){
  const [user, setUser] = useState(null);
  const [pref, setPref] = useState({ vehicleType: 'car', minExperience: 0 });
  const [matched, setMatched] = useState([]);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    // Fetch user info from backend
    async function fetchUser(){
      try {
        const res = await api.get('/user/profile');
        setUser(res.data.user);
      } catch(err) {
        alert('Failed to load user profile');
      }
    }
    fetchUser();
  }, []);

  async function createRequest(){
    try {
      const res = await api.post('/requests', {
        vehicleType: pref.vehicleType, minExperience: pref.minExperience,
        pickupAddress: 'Example address', time: new Date().toISOString()
      });
      setRequest(res.data.request);
      setMatched(res.data.matchedDrivers || []);
    } catch(err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  async function contactDriver(d){
    if (!request) return alert('Create a request first');
    try {
      await api.post(`/requests/${request.id}/select`, { driverId: d.id });
      alert('Driver contacted — waiting for response');
    } catch(err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Hello, {user.name}</h3>
      <div className="bg-white p-4 rounded mb-6">
        <div className="flex gap-3">
          <select value={pref.vehicleType} onChange={e=>setPref(p=>({...p, vehicleType:e.target.value}))} className="border rounded px-3 py-2">
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <input type="number" value={pref.minExperience} onChange={e=>setPref(p=>({...p, minExperience:Number(e.target.value)}))} className="border rounded px-3 py-2 w-28" />
          <button onClick={createRequest} className="bg-amber-500 px-4 py-2 text-white rounded">Find Drivers</button>
        </div>
      </div>

      <div className="space-y-3">
        {matched.length === 0 && <div className="text-gray-500">No matched drivers yet</div>}
        {matched.map(d => <DriverCard key={d.id} d={d} onContact={contactDriver} />)}
      </div>
    </div>
  );
}