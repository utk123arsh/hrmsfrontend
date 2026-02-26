import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="relative">
      <Sidebar />
      <div className="ml-64 relative z-10">
        <div className="p-8 bg-gray-50 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
