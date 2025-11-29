import React, { useState, useEffect } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import { warehouseApi, Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '../api/warehouseApi';

const WarehousePage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseApi.findAll();
      setWarehouses(data);
    } catch (err) {
      setError('창고정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        // 수정
        const updateDto: UpdateWarehouseDto = {
          warehouseCode: formData.warehouseCode,
          warehouseName: formData.warehouseName,
          location: formData.location,
          capacity: formData.capacity,
          currentStock: formData.currentStock,
          manager: formData.manager,
          phone: formData.phone,
          description: formData.description,
        };
        const updatedWarehouse = await warehouseApi.update(editingId, updateDto);
        setWarehouses((prev) =>
          prev.map((warehouse) => (warehouse.id === editingId ? updatedWarehouse : warehouse))
        );
      } else {
        // 등록
        const createDto: CreateWarehouseDto = {
          warehouseCode: formData.warehouseCode,
          warehouseName: formData.warehouseName,
          location: formData.location,
          capacity: formData.capacity,
          currentStock: formData.currentStock,
          manager: formData.manager,
          phone: formData.phone,
          description: formData.description,
        };
        const newWarehouse = await warehouseApi.create(createDto);
        setWarehouses((prev) => [...prev, newWarehouse]);
      }
      handleCloseModal();
    } catch (err) {
      setError(editingId ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
      console.error('Failed to save warehouse:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      try {
        setLoading(true);
        setError(null);
        await warehouseApi.remove(deleteTargetId);
        setWarehouses((prev) => prev.filter((warehouse) => warehouse.id !== deleteTargetId));
        setDeleteTargetId(null);
      } catch (err) {
        setError('삭제에 실패했습니다.');
        console.error('Failed to delete warehouse:', err);
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteConfirm(false);
  };


  const getUsageRate = (current: number, capacity: number) => {
    if (capacity === 0) return 0;
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
          처리 중...
        </div>
      )}
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
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="창고정보"
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

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="삭제 확인"
        message="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default WarehousePage;

