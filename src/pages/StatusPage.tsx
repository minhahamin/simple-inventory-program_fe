import React, { useState } from 'react';
import DataTable from '../components/DataTable';

interface StockStatus {
  id: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  stockStatus: string;
  lastInboundDate: string;
  lastOutboundDate: string;
}

const StatusPage: React.FC = () => {
  const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('전체');

  const filteredStatuses = stockStatuses.filter((status) => {
    const matchesSearch =
      status.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '전체' || status.stockStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return '부족';
    if (current <= min * 1.5) return '주의';
    return '정상';
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
            <option value="정상">정상</option>
            <option value="주의">주의</option>
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
            key: 'minStock',
            label: '최소재고',
            render: (item) => (
              <span className="text-gray-700">{item.minStock.toLocaleString()}</span>
            ),
          },
          {
            key: 'maxStock',
            label: '최대재고',
            render: (item) => (
              <span className="text-gray-700">{item.maxStock.toLocaleString()}</span>
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
              const stockStatus = getStockStatus(item.currentStock, item.minStock);
              return (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    stockStatus === '부족'
                      ? 'bg-red-100 text-red-800'
                      : stockStatus === '주의'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
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
