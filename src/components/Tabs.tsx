import React from 'react';

type PageType = 'items' | 'inbound' | 'outbound' | 'inventory' | 'status' | 'permission' | 'warehouse';

interface Tab {
  id: PageType;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: PageType;
  onTabClick: (page: PageType) => void;
  onTabClose: (page: PageType) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick, onTabClose }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group relative flex items-center gap-2 px-4 py-3 cursor-pointer border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onTabClick(tab.id)}
            >
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={`ml-1 p-1 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 hover:bg-blue-200'
                    : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;

