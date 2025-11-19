import React, { useCallback, useEffect, useState } from "react";
import { BookingService } from "../services/bookingService";
import { DriverService } from "../services/driverService";

type BookingRequest = {
  id: string;
  userId: string;
  period: string;
  status: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
};

const DriverDashboard=()=>{
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [driverId, setDriverId] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const driver = await DriverService.getProfile();
      const fetchedRequests = await BookingService.getDriverRequests(driver.id);

      setDriverId(driver.id);
      setRequests(fetchedRequests);
    } catch (err) {
      console.error("Failed to load driver dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRequestAction = useCallback(
    async (requestId: string, status: string) => {
      try {
        await BookingService.updateRequestStatus(requestId, status);
        await loadData();
        alert(`Request ${status} successfully!`);
      } catch (err) {
        console.error("Failed to update request status:", err);
        alert("Failed to update request");
      }
    },
    [loadData]
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-extrabold">Driver Dashboard</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-lg shadow-md p-6 border border-white/6">
          <h2 className="text-xl font-semibold mb-6 text-white">Booking Requests</h2>

          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-white/70 text-center py-8">No requests yet</p>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-white/6 rounded-lg p-6 bg-[rgba(255,255,255,0.015)]"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {request.user.name}
                      </h3>
                      <p className="text-white/70 mb-1">Period: {request.period}</p>
                      <p
                        className={`font-medium mb-4 ${
                          request.status === "accepted"
                            ? "text-green-400"
                            : request.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        Status: {request.status}
                      </p>

                      {request.status === "accepted" && (
                        <div className="bg-white/5 p-4 rounded-lg mt-4 border border-white/6">
                          <p className="font-medium mb-2 text-white">User Contact:</p>
                          <p className="text-sm text-white/80">📧 {request.user.email}</p>
                          <p className="text-sm text-white/80">📱 {request.user.phone}</p>
                        </div>
                      )}
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRequestAction(request.id, "accepted")}
                          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, "rejected")}
                          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard