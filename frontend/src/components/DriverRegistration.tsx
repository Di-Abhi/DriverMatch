import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { DriverService } from "../services/driverService";

  const DriverRegistration=()=> {
  const { user } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)]">
        <div className="text-white/80">Loading...</div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseFile) {
      setError("Please upload your driving license");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("clerkId", user.id);
      formData.append("name", name);
      formData.append("email", user.emailAddresses[0].emailAddress);
      formData.append("phone", phone);
      formData.append("licenseNo", licenseNo);
      formData.append("license", licenseFile);

      await DriverService.register(formData);
      navigate("/dashboard/driver");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-400 text-transparent bg-clip-text drop-shadow-md">
            Driver Registration
          </h2>
          <p className="text-sm text-white/70 mt-2">
            Upload your license and details to start receiving requests.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[rgba(255,255,255,0.03)] border border-white/6 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-white/8 rounded-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3 border border-white/8 rounded-r-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">Enter 10 digit mobile number</p>
            </div>

            {/* License No */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Driving License Number *
              </label>
              <input
                type="text"
                required
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-white/8 rounded-lg bg-white/2 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="DL-1234567890123"
              />
              <p className="text-xs text-white/60 mt-1">
                Enter your valid Indian driving license number
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Upload License Document *
              </label>

              <label className="w-full flex items-center gap-4 px-4 py-3 bg-white/3 border border-white/8 rounded-lg cursor-pointer hover:bg-white/5 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16v-4a4 4 0 018 0v4m-5 4h6"
                  />
                </svg>
                <span className="text-sm text-white/90">
                  {licenseFile ? licenseFile.name : "Click to upload image or PDF"}
                </span>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-white/60 mt-1">
                Upload clear image or PDF of your license
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-600/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-indigo-500 text-white py-3 rounded-full hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          By continuing you agree to our{" "}
          <span className="text-white/90">Terms</span> and{" "}
          <span className="text-white/90">Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}

export default DriverRegistration