import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { DriverService } from '../services/driverService';

interface State {
  name: string;
  phone: string;
  licenseNo: string;
  licenseFile: File | null;
  loading: boolean;
  error: string;
}

class DriverRegistrationClass extends React.Component<{ user: any; navigate: any }, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: props.user?.fullName || '',
      phone: '',
      licenseNo: '',
      licenseFile: null,
      loading: false,
      error: ''
    };
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      this.setState({ licenseFile: e.target.files[0] });
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!this.state.licenseFile) {
      this.setState({ error: 'Please upload your driving license' });
      return;
    }
    
    this.setState({ loading: true, error: '' });

    try {
      const { user } = this.props;
      const formData = new FormData();
      formData.append('clerkId', user.id);
      formData.append('name', this.state.name);
      formData.append('email', user.emailAddresses[0].emailAddress);
      formData.append('phone', this.state.phone);
      formData.append('licenseNo', this.state.licenseNo);
      formData.append('license', this.state.licenseFile);

      await DriverService.register(formData);
      this.props.navigate('/dashboard/driver');
    } catch (error: any) {
      console.error('Registration error:', error);
      this.setState({ error: error.response?.data?.error || 'Registration failed. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-400 text-transparent bg-clip-text drop-shadow-md">
              Driver Registration
            </h2>
            <p className="text-sm text-white/70 mt-2">Upload your license and details to start receiving requests.</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] border border-white/6 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
            <form onSubmit={this.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={this.state.name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  className="w-full px-4 py-3 border border-white/8 rounded-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Phone Number (India) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-white/8 bg-white/3 text-white/80 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={this.state.phone}
                    onChange={(e) => this.setState({ phone: e.target.value })}
                    className="flex-1 px-4 py-3 border border-white/8 rounded-r-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">Enter 10 digit mobile number</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Driving License Number *
                </label>
                <input
                  type="text"
                  required
                  value={this.state.licenseNo}
                  onChange={(e) => this.setState({ licenseNo: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-white/8 rounded-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="DL-1234567890123"
                />
                <p className="text-xs text-white/60 mt-1">Enter your valid Indian driving license number</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Upload License Document *
                </label>

                <label className="w-full flex items-center gap-4 px-4 py-3 bg-white/3 border border-white/8 rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4a4 4 0 018 0v4m-5 4h6" />
                  </svg>
                  <span className="text-sm text-white/90">{this.state.licenseFile ? this.state.licenseFile.name : 'Click to upload image or PDF'}</span>
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={this.handleFileChange}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-white/60 mt-1">Upload clear image or PDF of your license</p>
              </div>

              {this.state.error && (
                <div className="bg-red-600/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {this.state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={this.state.loading}
                className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-indigo-500 text-white py-3 rounded-full hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
              >
                {this.state.loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-white/60">
            By continuing you agree to our <span className="text-white/90">Terms</span> and <span className="text-white/90">Privacy Policy</span>.
          </div>
        </div>
      </div>
    );
  }
}

export function DriverRegistration() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)]">
        <div className="text-white/80">Loading...</div>
      </div>
    );
  }
  
  return <DriverRegistrationClass user={user} navigate={navigate} />;
}
