import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { DriverService } from "../services/driverService";
import { BookingService } from "../services/bookingService";
import { UserService } from "../services/userService";
import { clearAuthToken } from "../config/api";

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  available: boolean;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  createdAt: string;
};

type BookingRequest = {
  id: string;
  driverId: string;
  period: string;
  status: string;
  createdAt: string;
  driver: Driver;
};

type TabType = "drivers" | "requests" | "profile";

function DriverCard({
  driver,
  selectedPeriod,
  onRequest,
  isRequesting,
}: {
  driver: Driver;
  selectedPeriod: string;
  onRequest: (driverId: string) => void;
  isRequesting: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-md">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-xl">
              🚗
            </div>
            <div>
              <div className="text-xs text-white/60">Professional Driver</div>
              <div className="font-semibold text-lg">{driver.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">⭐ 4.8</div>
            <div className="text-xs text-green-400">Available</div>
          </div>
        </div>

        {/* Details Card */}
        <div className="mt-4 rounded-lg p-4 border border-white/6 bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/60">License No.</div>
              <div className="font-medium">{driver.licenseNo}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Booking</div>
              <div className="font-semibold capitalize">{selectedPeriod}</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <span>✓</span> Verified ID
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span> Licensed
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onRequest(driver.id)}
              disabled={isRequesting}
              className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium hover:brightness-95 transition disabled:opacity-60"
            >
              {isRequesting ? "Sending..." : "Send Request"}
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/90 hover:bg-white/5 transition"
            >
              {showDetails ? "Less" : "More"}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/6 text-sm text-white/70">
            <p className="mb-2">📍 Available in your area</p>
            <p className="mb-2">🕐 Quick response time</p>
            <p>🛡️ Background verified</p>
          </div>
        )}

        <div className="mt-4 text-xs text-white/50 text-center">
          Contact details shared after booking confirmation
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gradient-to-r from-transparent to-white/2 border-t border-white/6 text-sm text-white/60">
        <div className="flex items-center justify-between">
          <div>Fast booking</div>
          <div className="text-xs">Est. confirmation 5–15 min</div>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request }: { request: BookingRequest }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "cancelled": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return "✓";
      case "rejected": return "✕";
      case "cancelled": return "⊘";
      case "completed": return "★";
      default: return "⏳";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-md">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-xl">
              🚗
            </div>
            <div>
              <div className="text-xs text-white/60">Driver</div>
              <div className="font-semibold text-lg">{request.driver.name}</div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        {/* Booking Details */}
        <div className="mt-4 rounded-lg p-4 border border-white/6 bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/60">Booking Period</div>
              <div className="font-medium capitalize">{request.period}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Requested On</div>
              <div className="font-medium">{formatDate(request.createdAt)}</div>
            </div>
          </div>

          <div className="mt-3 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <span>🪪</span> License: {request.driver.licenseNo}
            </div>
          </div>
        </div>

        {/* Contact Details - Only shown when accepted */}
        {request.status === "accepted" && (
          <div className="mt-4 rounded-lg p-4 border border-green-500/20 bg-green-500/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400">✓</span>
              <span className="font-medium text-green-400">Booking Confirmed!</span>
            </div>
            <p className="text-sm text-white/80 mb-3">
              You can now contact your driver directly:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span>📧</span>
                <span className="text-white">{request.driver.email}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span>📱</span>
                <span className="text-white">{request.driver.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pending Message */}
        {request.status === "pending" && (
          <div className="mt-4 text-center text-sm text-white/50">
            ⏳ Waiting for driver to respond...
          </div>
        )}

        {/* Rejected Message */}
        {request.status === "rejected" && (
          <div className="mt-4 text-center text-sm text-red-400/70">
            This request was declined. Try requesting another driver.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gradient-to-r from-transparent to-white/2 border-t border-white/6 text-xs text-white/50">
        Request ID: {request.id.slice(0, 8)}...
      </div>
    </div>
  );
}

function UserDashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");
  const [loading, setLoading] = useState(true);
  const [requestingDriver, setRequestingDriver] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("drivers");

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const navigate = useNavigate();
  const { signOut } = useClerk();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await UserService.getProfile();
      const [fetchedDrivers, fetchedRequests] = await Promise.all([
        DriverService.getAllDrivers(),
        BookingService.getUserRequests(user.id),
      ]);

      setProfile(user);
      setDrivers(fetchedDrivers);
      setRequests(fetchedRequests);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await UserService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearAuthToken();
      await signOut();
      navigate("/sign-in");
    }
  };

  const handleBookingRequest = async (driverId: string) => {
    if (!profile?.id) return;

    setRequestingDriver(driverId);
    try {
      await BookingService.createRequest({
        userId: profile.id,
        driverId,
        period: selectedPeriod,
      });
      await loadData();
      setActiveTab("requests");
      alert("Request sent successfully! Check 'My Requests' tab for updates.");
    } catch (err) {
      console.error("Booking request failed:", err);
      alert("Failed to send request. You may already have a pending request with this driver.");
    } finally {
      setRequestingDriver(null);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditName(profile.name);
      setEditPhone(profile.phone.replace("+91", ""));
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editPhone.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await UserService.updateProfile({
        name: editName,
        phone: `+91${editPhone}`,
      });
      setProfile(updated);
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditName("");
    setEditPhone("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)]">
        <div className="text-white/80">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased">
      {/* Navbar */}
      <nav className="bg-black/30 border-b border-white/6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold">DriveConnect</h1>
            {profile && <p className="text-sm text-white/60">Welcome, {profile.name}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-lg hover:brightness-90 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 border-b border-white/10 pb-2">
          {[
            { key: "drivers", label: "Find Drivers", icon: "🚗", count: drivers.length },
            { key: "requests", label: "My Requests", icon: "📋", count: requests.length },
            { key: "profile", label: "Profile", icon: "👤" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4 py-2 rounded-t-lg font-medium transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white/10 text-white border-b-2 border-pink-500"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="space-y-6">
            {/* Booking Period Filter */}
            <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-white/6">
              <h2 className="text-lg font-semibold mb-3 text-white">Select Booking Period</h2>
              <div className="flex flex-wrap gap-3">
                {["hourly", "daily", "weekly", "monthly"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-5 py-2 rounded-full font-medium transition ${
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg"
                        : "bg-white/6 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Drivers Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">
                Available Drivers ({drivers.length})
              </h2>
              {drivers.length === 0 ? (
                <div className="text-center py-12 bg-[rgba(255,255,255,0.02)] rounded-xl border border-white/6">
                  <div className="text-4xl mb-4">🚗</div>
                  <p className="text-white/70">No drivers available at the moment</p>
                  <p className="text-sm text-white/50 mt-2">Please check back later</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      selectedPeriod={selectedPeriod}
                      onRequest={handleBookingRequest}
                      isRequesting={requestingDriver === driver.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">
              My Booking Requests ({requests.length})
            </h2>
            {requests.length === 0 ? (
              <div className="text-center py-12 bg-[rgba(255,255,255,0.02)] rounded-xl border border-white/6">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-white/70">No booking requests yet</p>
                <p className="text-sm text-white/50 mt-2">
                  Find a driver and send a request to get started
                </p>
                <button
                  onClick={() => setActiveTab("drivers")}
                  className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-medium"
                >
                  Find Drivers
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[rgba(255,255,255,0.02)] rounded-xl shadow-md p-6 border border-white/6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">My Profile</h2>
                {!isEditingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 border border-white/8 rounded-lg bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-white/8 bg-white/5 text-white/80 rounded-l-lg">+91</span>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))}
                        maxLength={10}
                        className="flex-1 px-4 py-3 border border-white/8 rounded-r-lg bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium hover:brightness-95 transition disabled:opacity-60"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-2xl">
                        👤
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{profile.name}</h3>
                        <p className="text-white/60 text-sm">User Account</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/6 space-y-3">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider">Email</p>
                        <p className="text-white/90">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider">Phone</p>
                        <p className="text-white/90">{profile.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider">Member Since</p>
                        <p className="text-white/90">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/6">
                    <h3 className="font-semibold mb-4">Booking Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-pink-400">{requests.length}</p>
                        <p className="text-xs text-white/60">Total Requests</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">
                          {requests.filter((r) => r.status === "accepted").length}
                        </p>
                        <p className="text-xs text-white/60">Accepted</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-400">
                          {requests.filter((r) => r.status === "pending").length}
                        </p>
                        <p className="text-xs text-white/60">Pending</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-red-400">
                          {requests.filter((r) => r.status === "rejected").length}
                        </p>
                        <p className="text-xs text-white/60">Rejected</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;