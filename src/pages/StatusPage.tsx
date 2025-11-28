import React, { useState } from 'react';
import DataTable from '../components/DataTable';

interface StockStatus {
  id: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  safeStock: number;
  unit: string;
  location: string;
  stockStatus: string;
  lastInboundDate: string;
  lastOutboundDate: string;
}

const StatusPage: React.FC = () => {
  const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([
    {
      id: '1',
      itemCode: 'ITM-001',
      itemName: '노트북',
      currentStock: 5,
      safeStock: 10,
      unit: '개',
      location: 'A-1-1',
      stockStatus: '부족',
      lastInboundDate: '2024-01-15',
      lastOutboundDate: '2024-01-20',
    },
    {
      id: '2',
      itemCode: 'ITM-002',
      itemName: '마우스',
      currentStock: 30,
      safeStock: 20,
      unit: '개',
      location: 'A-1-2',
      stockStatus: '안전',
      lastInboundDate: '2024-01-16',
      lastOutboundDate: '2024-01-21',
    },
    {
      id: '3',
      itemCode: 'ITM-003',
      itemName: '키보드',
      currentStock: 20,
      safeStock: 15,
      unit: '개',
      location: 'A-1-3',
      stockStatus: '안전',
      lastInboundDate: '2024-01-17',
      lastOutboundDate: '2024-01-22',
    },
    {
      id: '4',
      itemCode: 'ITM-004',
      itemName: '모니터',
      currentStock: 12,
      safeStock: 10,
      unit: '개',
      location: 'A-2-1',
      stockStatus: '안전',
      lastInboundDate: '2024-01-18',
      lastOutboundDate: '2024-01-23',
    },
    {
      id: '5',
      itemCode: 'ITM-005',
      itemName: '의자',
      currentStock: 10,
      safeStock: 5,
      unit: '개',
      location: 'B-1-1',
      stockStatus: '안전',
      lastInboundDate: '2024-01-19',
      lastOutboundDate: '2024-01-24',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('전체');

  const filteredStatuses = stockStatuses.filter((status) => {
    const matchesSearch =
      status.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '전체' || status.stockStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (current: number, safe: number) => {
    if (current > safe) return '안전';
    return '부족';
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">재고현황</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="품목코드 또는 품목명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="전체">전체</option>
            <option value="안전">안전</option>
            <option value="부족">부족</option>
          </select>
        </div>
      </div>

      {/* 재고현황 테이블 */}
      <DataTable
        columns={[
          {
            key: 'itemCode',
            label: '품목코드',
            render: (item) => (
              <span className="font-semibold text-blue-600">{item.itemCode}</span>
            ),
          },
          {
            key: 'itemName',
            label: '품목명',
            render: (item) => <span className="text-gray-700">{item.itemName}</span>,
          },
          {
            key: 'currentStock',
            label: '현재재고',
            render: (item) => (
              <span className="font-semibold text-gray-900">{item.currentStock.toLocaleString()}</span>
            ),
          },
          {
            key: 'safeStock',
            label: '안전재고',
            render: (item) => (
              <span className="text-gray-700">{item.safeStock.toLocaleString()}</span>
            ),
          },
          {
            key: 'unit',
            label: '단위',
            render: (item) => (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                {item.unit}
              </span>
            ),
          },
          {
            key: 'location',
            label: '보관위치',
            render: (item) => (
              <span className="text-gray-700">{item.location}</span>
            ),
          },
          {
            key: 'stockStatus',
            label: '재고상태',
            render: (item) => {
              const stockStatus = getStockStatus(item.currentStock, item.safeStock);
              return (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    stockStatus === '안전'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stockStatus}
                </span>
              );
            },
          },
          {
            key: 'lastInboundDate',
            label: '최종입고일',
            render: (item) => (
              <span className="text-gray-700">{item.lastInboundDate || '-'}</span>
            ),
          },
          {
            key: 'lastOutboundDate',
            label: '최종출고일',
            render: (item) => (
              <span className="text-gray-700">{item.lastOutboundDate || '-'}</span>
            ),
          },
        ]}
        data={filteredStatuses}
        emptyMessage={stockStatuses.length === 0 ? '등록된 재고현황이 없습니다.' : '검색 결과가 없습니다.'}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};

export default StatusPage;
