import { useEffect, useState } from "react";

export default function DriverDashboard(){

  const [user, setUser] = useState(null);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    async function loadData(){
      try {
        const userRes = await api.get('/driver/profile');
        setUser(userRes.data.user);
        setOnline(userRes.data.user.isOnline);

        const requestRes = await api.get('/driver/assigned-requests');
        setIncoming(requestRes.data.requests || []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function toggleOnlineStatus() {
    try {
      const res = await api.post('/driver/toggle-online', { isOnline: !online });
      setOnline(res.data.user.isOnline);
      alert(`You are now ${res.data.user.isOnline ? 'Online' : 'Offline'}`);
    } catch (err) {
      alert('Failed to update online status');
    }
  }

  async function respond(requestId, action){
    try {
      await api.post(`/requests/${requestId}/driver-response`, { action });
      alert(action === 'accept' ? 'Accepted' : 'Rejected');

      const res = await api.get('/driver/assigned-requests');
      setIncoming(res.data.requests || []);
    } catch(err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Driver Dashboard</h3>

      {/* Online Toggle Button */}
      <button 
        onClick={toggleOnlineStatus} 
        className={`px-4 py-2 rounded mb-4 text-white 
          ${online ? 'bg-red-600' : 'bg-green-600'}`}>
        {online ? 'Go Offline' : 'Go Online'}
      </button>

      {/* Requests */}
      {incoming.length === 0 && <div>No incoming requests</div>}

      {incoming.map(r => (
        <div key={r.id} className="p-3 border rounded mb-3 flex justify-between">
          <div>
            <div className="font-semibold">{r.userName}</div>

            {r.status === 'ACCEPTED' && (
              <div className="text-sm text-gray-600">
                Phone: {r.userPhone}<br />
                Email: {r.userEmail}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {r.status !== 'ACCEPTED' && (
              <>
                <button onClick={()=>respond(r.id,'accept')} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                <button onClick={()=>respond(r.id,'reject')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
