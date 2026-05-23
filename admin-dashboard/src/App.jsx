import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ControlPanelLayout from "./layouts/ControlPanelLayout";

import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";
import Events from "./pages/Events";
import Payments from "./pages/Payments";
import CategoryManagement from "./pages/CategoryManagement";
import ContentModeration from "./pages/ContentModeration";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";


import EditProfile from "./components/EditProfile";
import AdminLogin from "./pages/adminLogin";
import RequireAdminAuth from "./components/RequireAdminAuth";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const closeListener = () => setIsSidebarOpen(false);
    document.addEventListener("closeSidebar", closeListener);
    return () => document.removeEventListener("closeSidebar", closeListener);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">






      <main className="flex-1">

        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} /> */}
          <Route
            path="/"
            element={
              <RequireAdminAuth>
                <Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <Dashboard />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          <Route
            path="/edit"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <EditProfile />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          <Route
            path="/approvals"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <Approvals />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          <Route
            path="/events"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <Events />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          <Route
            path="/payments"
            element={
              <RequireAdminAuth>
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                  <Payments />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          {/* ✅ CATEGORY MANAGEMENT */}
          <Route
            path="/category"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <CategoryManagement />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          {/* ✅ CONTENT MODERATION */}
          <Route
            path="/content-moderation"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <ContentModeration />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />
          {/* ✅ ANALYTICS DASHBOARD */}
          <Route
            path="/analytics"
            element={
              <RequireAdminAuth>
<Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                  <AnalyticsDashboard />
                </ControlPanelLayout>
              </RequireAdminAuth>
            }
          />

          <Route
            path="*"
            element={
              <ControlPanelLayout title="" isSidebarOpen={isSidebarOpen}>
                <h1 className="text-gray-900">Not Found</h1>
              </ControlPanelLayout>
            }
          />


        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
