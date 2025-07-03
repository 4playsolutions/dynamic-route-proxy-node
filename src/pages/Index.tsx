
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
