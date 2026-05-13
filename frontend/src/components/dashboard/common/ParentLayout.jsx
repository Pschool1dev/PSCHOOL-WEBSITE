import React from 'react';

import SidebarParent from './SidebarParent';
import HeaderParent from './HeaderParent';

const ParentLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <SidebarParent />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderParent title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;