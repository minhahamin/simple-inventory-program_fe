import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';

interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  phone: string;
  description: string;
}

const WarehousePage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      warehouseCode: 'WH-001',
      warehouseName: '본사 창고',
      location: '서울시 강남구',
      capacity: 10000,
      currentStock: 7500,
      manager: '김창고',
      phone: '010-1234-5678',
      description: '본사 메인 창고',
    },
    {
      id: '2',
      warehouseCode: 'WH-002',
      warehouseName: '부산 지점 창고',
      location: '부산시 해운대구',
      capacity: 5000,
      currentStock: 3200,
      manager: '이창고',
      phone: '010-2345-6789',
      description: '부산 지점 창고',
    },
    {
      id: '3',
      warehouseCode: 'WH-003',
      warehouseName: '대구 물류센터',
      location: '대구시 수성구',
      capacity: 8000,
      currentStock: 5800,
      manager: '박창고',
      phone: '010-3456-7890',
      description: '대구 지역 물류센터',
    },
    {
      id: '4',
      warehouseCode: 'WH-004',
      warehouseName: '인천 창고',
      location: '인천시 남동구',
      capacity: 6000,
      currentStock: 4200,
      manager: '최창고',
      phone: '010-4567-8901',
      description: '인천 지역 창고',
    },
    {
      id: '5',
      warehouseCode: 'WH-005',
      warehouseName: '광주 창고',
      location: '광주시 광산구',
      capacity: 4000,
      currentStock: 2100,
      manager: '정창고',
      phone: '010-5678-9012',
      description: '광주 지역 창고',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Warehouse, 'id'>>({
    warehouseCode: '',
    warehouseName: '',
    location: '',
    capacity: 0,
    currentStock: 0,
    manager: '',
    phone: '',
    description: '',
  });

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const warehouse = warehouses.find((warehouse) => warehouse.id === id);
    if (warehouse) {
      setEditingId(id);
      setFormData({
        warehouseCode: warehouse.warehouseCode,
        warehouseName: warehouse.warehouseName,
        location: warehouse.location,
        capacity: warehouse.capacity,
        currentStock: warehouse.currentStock,
        manager: warehouse.manager,
        phone: warehouse.phone,
        description: warehouse.description,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      warehouseCode: '',
      warehouseName: '',
      location: '',
      capacity: 0,
      currentStock: 0,
      manager: '',
      phone: '',
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'currentStock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setWarehouses((prev) =>
        prev.map((warehouse) => (warehouse.id === editingId ? { ...warehouse, ...formData } : warehouse))
      );
    } else {
      const newWarehouse: Warehouse = {
        id: Date.now().toString(),
        ...formData,
      };
      setWarehouses((prev) => [...prev, newWarehouse]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setWarehouses((prev) => prev.filter((warehouse) => warehouse.id !== id));
    }
  };


  const getUsageRate = (current: number, capacity: number) => {
    if (capacity === 0) return 0;
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">창고정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="창고코드, 창고명, 위치, 담당자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            등록
          </button>
        </div>
      </div>

      {/* 창고 리스트 테이블 */}
      <DataTable
        columns={[
          {
            key: 'warehouseCode',
            label: '창고코드',
            render: (item) => (
              <span className="font-semibold text-blue-600">{item.warehouseCode}</span>
            ),
          },
          {
            key: 'warehouseName',
            label: '창고명',
            render: (item) => <span className="text-gray-700 font-medium">{item.warehouseName}</span>,
          },
          {
            key: 'location',
            label: '위치',
            render: (item) => (
              <span className="text-gray-700">{item.location}</span>
            ),
          },
          {
            key: 'capacity',
            label: '용량',
            render: (item) => (
              <span className="text-gray-700">{item.capacity.toLocaleString()}</span>
            ),
          },
          {
            key: 'currentStock',
            label: '현재재고',
            render: (item) => (
              <span className="font-semibold text-gray-900">{item.currentStock.toLocaleString()}</span>
            ),
          },
          {
            key: 'usageRate',
            label: '사용률',
            render: (item) => {
              const usageRate = getUsageRate(item.currentStock, item.capacity);
              return (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    usageRate >= 90
                      ? 'bg-red-100 text-red-800'
                      : usageRate >= 70
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {usageRate}%
                </span>
              );
            },
          },
          {
            key: 'manager',
            label: '담당자',
            render: (item) => (
              <span className="text-gray-700">{item.manager}</span>
            ),
          },
          {
            key: 'phone',
            label: '연락처',
            render: (item) => (
              <span className="text-gray-700">{item.phone}</span>
            ),
          },
          {
            key: 'description',
            label: '설명',
            render: (item) => (
              <span className="text-gray-600 max-w-xs truncate block">{item.description || '-'}</span>
            ),
          },
          {
            key: 'actions',
            label: '작업',
            align: 'right',
            render: (item) => (
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-150"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-150"
                >
                  삭제
                </button>
              </div>
            ),
          },
        ]}
        data={filteredWarehouses}
        emptyMessage={warehouses.length === 0 ? '등록된 창고정보가 없습니다.' : '검색 결과가 없습니다.'}
        keyExtractor={(item) => item.id}
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '창고 수정' : '창고 등록'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    창고코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="warehouseCode"
                    value={formData.warehouseCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: WH-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    창고명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="warehouseName"
                    value={formData.warehouseName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="창고명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    위치 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 서울시 강남구"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    용량 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    현재재고 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    담당자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="담당자명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="창고에 대한 설명을 입력하세요"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editingId ? '수정' : '등록'}
                </button>
              </div>
        </form>
      </DraggableModal>
    </div>
  );
};

export default WarehousePage;

