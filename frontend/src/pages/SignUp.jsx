import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function SignUp(){
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'USER',
    experienceYears: 0, workType: 'FULLTIME', licenseNo: '',
    vehicleType: 'bike', vehicleModel: '', vehicleNumber: ''
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  function update(k, v){ setForm(f=>({ ...f, [k]: v })); }

  function onFile(e){
    const f = e.target.files?.[0]; if (!f) return;
    setLicenseFile(f); setPreview(URL.createObjectURL(f));
  }

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (form.role === 'DRIVER') {
        const fd = new FormData();
        for (const k of ['name','email','password','role','experienceYears','workType','licenseNo','vehicleType','vehicleModel','vehicleNumber']) {
          fd.append(k, form[k]);
        }
        if (licenseFile) fd.append('licensePhoto', licenseFile);
        const res = await api.post('/auth/signup', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        nav('/driver');
      } else {
        const res = await api.post('/auth/signup', {
          name: form.name, email: form.email, password: form.password, role: 'USER'
        });
        nav('/user');
      }
    } catch(err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      alert(errorMsg);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm">Full name</label>
            <input required value={form.name} onChange={e=>update('name', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input required type="email" value={form.email} onChange={e=>update('email', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input required type="password" value={form.password} onChange={e=>update('password', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm">Signup as</label>
            <select value={form.role} onChange={e=>update('role', e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="USER">User</option>
              <option value="DRIVER">Driver</option>
            </select>
          </div>

          {form.role === 'DRIVER' && <>
            <div>
              <label className="block text-sm">Experience (years)</label>
              <input type="number" value={form.experienceYears} onChange={e=>update('experienceYears', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm">Work type</label>
              <select value={form.workType} onChange={e=>update('workType', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="FULLTIME">Full-time</option>
                <option value="PARTTIME">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">License number</label>
              <input value={form.licenseNo} onChange={e=>update('licenseNo', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm">Upload license photo</label>
              <div className="flex items-center gap-3 mt-2">
                <input accept="image/*" type="file" onChange={onFile} />
                {preview && <img src={preview} alt="preview" className="w-28 h-20 object-cover rounded border" />}
              </div>
            </div>

            <div>
              <label className="block text-sm">Vehicle type</label>
              <select value={form.vehicleType} onChange={e=>update('vehicleType', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="bike">Bike</option>
                <option value="car">Car</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Vehicle model</label>
              <input value={form.vehicleModel} onChange={e=>update('vehicleModel', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm">Vehicle registration number</label>
              <input value={form.vehicleNumber} onChange={e=>update('vehicleNumber', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </>}

          <div className="md:col-span-2">
            <button disabled={loading} className="w-full bg-amber-500 text-white py-2 rounded">
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}