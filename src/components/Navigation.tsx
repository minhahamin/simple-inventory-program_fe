import React from 'react';

type PageType = 'items' | 'inbound' | 'outbound' | 'inventory' | 'status' | 'permission' | 'warehouse' | 'inoutStatus';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const menuItems: { id: PageType; label: string }[] = [
    { id: 'items', label: '품목정보' },
    { id: 'inbound', label: '입고정보' },
    { id: 'outbound', label: '출고정보' },
    { id: 'inoutStatus', label: '입출고현황' },
    { id: 'warehouse', label: '창고정보' },
    { id: 'inventory', label: '재고정보' },
    { id: 'status', label: '재고현황' },
    { id: 'permission', label: '권한정보' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg border-b border-slate-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div className="nav-logo flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="m-0 py-4 text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            자재관리 시스템
          </h2>
        </div>
        <ul className="flex list-none m-0 p-0 gap-1">
          {menuItems.map((item) => (
            <li key={item.id} className="m-0">
              <button
                className={`relative px-5 py-4 cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 border-none ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

