import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAdminButton from '../components/FloatingAdminButton';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingAdminButton />
    </div>
  );
}
