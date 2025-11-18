import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/userService';

interface State {
  name: string;
  phone: string;
  loading: boolean;
  error: string;
}

class UserRegistrationClass extends React.Component<{ user: any; navigate: any }, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: props.user?.fullName || '',
      phone: '',
      loading: false,
      error: ''
    };
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      const { user } = this.props;
      await UserService.register({
        clerkId: user.id,
        name: this.state.name,
        email: user.emailAddresses[0].emailAddress,
        phone: this.state.phone
      });
      this.props.navigate('/dashboard/user');
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
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-400 text-transparent bg-clip-text drop-shadow-md">
              Complete Your Profile
            </h2>
            <p className="text-sm text-white/70 mt-2">Almost there — just a few details to finish setup.</p>
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

export function UserRegistration() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)]">
        <div className="text-white/80">Loading...</div>
      </div>
    );
  }
  
  return <UserRegistrationClass user={user} navigate={navigate} />;
}
