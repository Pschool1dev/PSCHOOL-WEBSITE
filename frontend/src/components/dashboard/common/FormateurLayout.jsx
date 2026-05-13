import React from 'react';

import SidebarFormateur from './SidebarFormateur'; 
import HeaderFormateur from './HeaderFormateur';
const FormateurLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      <SidebarFormateur />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderFormateur title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FormateurLayout;