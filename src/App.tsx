import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ItemsPage from './pages/ItemsPage';
import InboundPage from './pages/InboundPage';
import OutboundPage from './pages/OutboundPage';
import InventoryPage from './pages/InventoryPage';
import StatusPage from './pages/StatusPage';
import WarehousePage from './pages/WarehousePage';
import PermissionPage from './pages/PermissionPage';

type PageType = 'items' | 'inbound' | 'outbound' | 'inventory' | 'status' | 'warehouse' | 'permission';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('items');

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
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
      default:
        return <ItemsPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 bg-gray-100">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

