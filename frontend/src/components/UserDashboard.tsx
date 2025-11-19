import React, { useCallback, useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { DriverService } from "../services/driverService";
import { BookingService } from "../services/bookingService";
import { UserService } from "../services/userService";

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  available: boolean;
};

type BookingRequest = {
  id: string;
  driverId: string;
  period: string;
  status: string;
  driver: Driver;
};

const UserDashboard=()=> {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("hourly");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await UserService.getProfile();
      const [fetchedDrivers, fetchedRequests] = await Promise.all([
        DriverService.getAllDrivers(),
        BookingService.getUserRequests(user.id),
      ]);

      setUserId(user.id);
      setDrivers(fetchedDrivers);
      setRequests(fetchedRequests);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await UserService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      navigate("/sign-in");
    }
  };

  const handleBookingRequest = async (driverId: string) => {
    try {
      await BookingService.createRequest({
        userId,
        driverId,
        period: selectedPeriod,
      });
      await loadData();
      alert("Request sent successfully!");
    } catch (err) {
      console.error("Booking request failed:", err);
      alert("Failed to send request");
    }
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
      {/* NAVBAR */}
      <nav className="bg-black/30 border-b border-white/6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold">User Dashboard</h1>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-lg hover:brightness-90 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Booking Period Filter */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-lg shadow-md p-6 border border-white/6">
          <h2 className="text-xl font-semibold mb-4 text-white">Select Booking Period</h2>
          <div className="flex gap-4">
            {["hourly", "daily", "monthly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-full font-medium transition ${
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

        {/* Available Drivers */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-lg shadow-md p-6 border border-white/6">
          <h2 className="text-xl font-semibold mb-6 text-white">Available Drivers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="border border-white/6 rounded-xl p-6 bg-[rgba(255,255,255,0.025)]">
                <h3 className="text-lg font-semibold mb-2 text-white">{driver.name}</h3>
                <p className="text-white/70 mb-1">📧 {driver.email}</p>
                <p className="text-white/70 mb-1">📱 {driver.phone}</p>
                <p className="text-white/70 mb-4">🪪 {driver.licenseNo}</p>
                <button
                  onClick={() => handleBookingRequest(driver.id)}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white py-2 rounded-full hover:brightness-95 transition"
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Requests */}
        <div className="bg-[rgba(255,255,255,0.02)] rounded-lg shadow-md p-6 border border-white/6">
          <h2 className="text-xl font-semibold mb-6 text-white">My Booking Requests</h2>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-white/6 rounded-lg p-6 bg-[rgba(255,255,255,0.015)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{request.driver.name}</h3>
                    <p className="text-white/70">Period: {request.period}</p>
                    <p
                      className={`font-medium mt-2 ${
                        request.status === "accepted"
                          ? "text-green-400"
                          : request.status === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      Status: {request.status}
                    </p>
                  </div>

                  {request.status === "accepted" && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/6">
                      <p className="font-medium mb-2 text-white">Driver Contact:</p>
                      <p className="text-sm text-white/80">📧 {request.driver.email}</p>
                      <p className="text-sm text-white/80">📱 {request.driver.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default UserDashboard;