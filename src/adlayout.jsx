
import React from 'react';
import Sidebar from './sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-blue-100">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
