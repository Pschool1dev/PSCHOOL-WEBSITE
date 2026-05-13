import SidebarApprenant from './SidebarApprenant';
import HeaderApprenant from './HeaderApprenant';

const ApprenantLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarApprenant />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderApprenant title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ApprenantLayout;