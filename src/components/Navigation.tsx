import React from 'react';

type PageType = 'items' | 'inbound' | 'outbound' | 'inventory' | 'status' | 'permission' | 'warehouse';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const menuItems: { id: PageType; label: string }[] = [
    { id: 'items', label: '품목정보' },
    { id: 'inbound', label: '입고정보' },
    { id: 'outbound', label: '출고정보' },
    { id: 'warehouse', label: '창고정보' },
    { id: 'inventory', label: '재고정보' },
    { id: 'status', label: '재고현황' },

    { id: 'permission', label: '권한정보' },
  ];

  return (
    <nav className="bg-slate-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5">
        <div className="nav-logo">
          <h2 className="m-0 py-4 text-2xl font-semibold">자재관리 시스템</h2>
        </div>
        <ul className="flex list-none m-0 p-0 gap-1">
          {menuItems.map((item) => (
            <li key={item.id} className="m-0">
              <button
                className={`px-5 py-4 cursor-pointer text-base rounded transition-colors duration-300 border-none ${
                  currentPage === item.id
                    ? 'bg-blue-500 font-semibold hover:bg-blue-600'
                    : 'bg-transparent hover:bg-slate-600'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

