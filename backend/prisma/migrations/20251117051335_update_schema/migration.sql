-- CreateIndex
CREATE INDEX "driver_profiles_serviceType_idx" ON "driver_profiles"("serviceType");

-- CreateIndex
CREATE INDEX "driver_profiles_isAvailable_idx" ON "driver_profiles"("isAvailable");

-- CreateIndex
CREATE INDEX "service_requests_customerId_idx" ON "service_requests"("customerId");

-- CreateIndex
CREATE INDEX "service_requests_driverId_idx" ON "service_requests"("driverId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_serviceType_idx" ON "service_requests"("serviceType");

-- CreateIndex
CREATE INDEX "users_type_idx" ON "users"("type");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");
