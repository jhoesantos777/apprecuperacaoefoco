import React, { useState, useEffect } from 'react';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminPremium } from "@/components/admin/AdminPremium";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminContent } from "@/components/admin/AdminContent";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminCertificates } from "@/components/admin/AdminCertificates";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("users");

  useEffect(() => {
    // Check if the user is an admin
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      // You could redirect non-admins here, but we'll keep it simple
      console.warn("Non-admin user accessing admin page");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "premium":
        return <AdminPremium />;
      case "content":
        return <AdminContent />;
      case "courses":
        return <AdminCourses />;
      case "certificates":
        return <AdminCertificates />;
      default:
        return <AdminUsers />;
    }
  };

  return (
    <div 
      className="flex min-h-screen"
      style={{
        backgroundImage: 'url("/bg-gradient-teal.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
