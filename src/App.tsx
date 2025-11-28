import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Tabs from './components/Tabs';
import ItemsPage from './pages/ItemsPage';
import InboundPage from './pages/InboundPage';
import OutboundPage from './pages/OutboundPage';
import InventoryPage from './pages/InventoryPage';
import StatusPage from './pages/StatusPage';
import WarehousePage from './pages/WarehousePage';
import PermissionPage from './pages/PermissionPage';
import InOutStatusPage from './pages/InOutStatusPage';

type PageType = 'items' | 'inbound' | 'outbound' | 'inventory' | 'status' | 'warehouse' | 'permission' | 'inoutStatus';

interface Tab {
  id: PageType;
  label: string;
}

const pageLabels: Record<PageType, string> = {
  items: '품목정보',
  inbound: '입고정보',
  outbound: '출고정보',
  warehouse: '창고정보',
  inventory: '재고정보',
  status: '재고현황',
  permission: '권한정보',
  inoutStatus: '입출고현황',
};

const STORAGE_KEY_TABS = 'inventory_app_tabs';
const STORAGE_KEY_ACTIVE_TAB = 'inventory_app_active_tab';

function App() {
  // localStorage에서 초기 상태 복원
  const getInitialState = (): { tabs: Tab[]; activeTab: PageType } => {
    try {
      const savedTabs = localStorage.getItem(STORAGE_KEY_TABS);
      const savedActiveTab = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);
      
      let restoredTabs: Tab[] = [{ id: 'items', label: '품목정보' }];
      let restoredActiveTab: PageType = 'items';

      if (savedTabs) {
        const parsed = JSON.parse(savedTabs) as Tab[];
        // 유효한 탭인지 확인
        const validTabs = parsed.filter((tab: Tab) => tab.id in pageLabels) as Tab[];
        if (validTabs.length > 0) {
          restoredTabs = validTabs;
        }
      }

      if (savedActiveTab && savedActiveTab in pageLabels) {
        // 활성 탭이 복원된 탭 목록에 있는지 확인
        const tabExists = restoredTabs.some(tab => tab.id === savedActiveTab);
        if (tabExists) {
          restoredActiveTab = savedActiveTab as PageType;
        } else {
          // 없으면 첫 번째 탭을 활성 탭으로 설정
          restoredActiveTab = restoredTabs[0].id;
        }
      } else {
        restoredActiveTab = restoredTabs[0].id;
      }

      return { tabs: restoredTabs, activeTab: restoredActiveTab };
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return { tabs: [{ id: 'items', label: '품목정보' }], activeTab: 'items' };
    }
  };

  const initialState = getInitialState();
  const [tabs, setTabs] = useState<Tab[]>(initialState.tabs);
  const [activeTab, setActiveTab] = useState<PageType>(initialState.activeTab);

  // 탭 상태를 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(tabs));
    } catch (error) {
      console.error('Failed to save tabs to localStorage:', error);
    }
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
    } catch (error) {
      console.error('Failed to save active tab to localStorage:', error);
    }
  }, [activeTab]);

  const handleNavigate = (page: PageType) => {
    // 이미 열려있는 탭인지 확인
    const existingTab = tabs.find((tab) => tab.id === page);
    
    if (existingTab) {
      // 이미 열려있으면 해당 탭으로 전환
      setActiveTab(page);
    } else {
      // 새 탭 추가
      const newTab: Tab = { id: page, label: pageLabels[page] };
      setTabs([...tabs, newTab]);
      setActiveTab(page);
    }
  };

  const handleTabClick = (page: PageType) => {
    setActiveTab(page);
  };

  const handleTabClose = (page: PageType) => {
    if (tabs.length === 1) {
      // 마지막 탭은 닫을 수 없음
      return;
    }

    const newTabs = tabs.filter((tab) => tab.id !== page);
    setTabs(newTabs);

    // 닫은 탭이 활성 탭이었다면 다른 탭으로 전환
    if (activeTab === page) {
      const lastTab = newTabs[newTabs.length - 1];
      setActiveTab(lastTab.id);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'items':
        return <ItemsPage />;
      case 'inbound':
        return <InboundPage />;
      case 'outbound':
        return <OutboundPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'status':
        return <StatusPage />;
      case 'warehouse':
        return <WarehousePage />;
      case 'permission':
        return <PermissionPage />;
      case 'inoutStatus':
        return <InOutStatusPage />;
      default:
        return <ItemsPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={activeTab} onNavigate={handleNavigate} />
      {tabs.length > 0 && (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
        />
      )}
      <main className="flex-1 bg-gray-100">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

