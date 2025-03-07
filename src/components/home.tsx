import React from "react";
import Layout from "./layout/Layout";
import DashboardOverview from "./dashboard/DashboardOverview";
import LoginForm from "./auth/LoginForm";

interface HomeProps {
  isAuthenticated?: boolean;
}

const Home = ({ isAuthenticated = true }: HomeProps) => {
  // In a real application, this would be determined by an auth system
  // For now, we'll use a prop with a default value of true to show the dashboard

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <DashboardOverview />
      </Layout>
    </div>
  );
};

export default Home;
