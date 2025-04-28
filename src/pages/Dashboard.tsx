import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardCategories } from '@/components/dashboard/DashboardCategories';
import { BottomNavigation } from '@/components/dashboard/BottomNavigation';
import { SobrietyButton } from '@/components/dashboard/SobrietyButton';
import FamilyDashboard from '@/components/FamilyDashboard';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [hasConfirmedSobriety, setHasConfirmedSobriety] = useState(false);
  const [userRole, setUserRole] = useState<string>("dependent");
  
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      const checkUserRole = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.tipoUsuario) {
          setUserRole(user.user_metadata.tipoUsuario);
          localStorage.setItem("userRole", user.user_metadata.tipoUsuario);
        }
      };
      checkUserRole();
    }
  }, []);

  const { data: profile } = useUserProfile(userRole);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900">
      <DashboardHeader profile={profile} userRole={userRole} />

      {userRole === "family" ? (
        <FamilyDashboard />
      ) : userRole === "admin" ? (
        <DashboardCategories userRole={userRole} />
      ) : (
        <>
          <SobrietyButton 
            hasConfirmedSobriety={hasConfirmedSobriety}
            onConfirm={() => setHasConfirmedSobriety(true)}
          />
          <DashboardCategories userRole={userRole} />
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
