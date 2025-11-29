import React, { useState, useEffect } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import { inventoryApi, Inventory, CreateInventoryDto, UpdateInventoryDto } from '../api/inventoryApi';

const InventoryPage: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Inventory, 'id'>>({
    itemCode: '',
    itemName: '',
    currentStock: 0,
    safeStock: 0,
    unit: '',
    location: '',
    status: '정상',
  });

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.findAll();
      setInventories(data);
    } catch (err) {
      setError('재고정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch inventories:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventories = inventories.filter((inventory) => {
    const matchesSearch =
      inventory.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const inventory = inventories.find((inventory) => inventory.id === id);
    if (inventory) {
      setEditingId(id);
      setFormData({
        itemCode: inventory.itemCode,
        itemName: inventory.itemName,
        currentStock: inventory.currentStock,
        safeStock: inventory.safeStock,
        unit: inventory.unit,
        location: inventory.location,
        status: inventory.status,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
      setFormData({
        itemCode: '',
        itemName: '',
        currentStock: 0,
        safeStock: 0,
        unit: '',
        location: '',
        status: '정상',
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'safeStock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        // 수정
        const updateDto: UpdateInventoryDto = {
          itemCode: formData.itemCode,
          itemName: formData.itemName,
          currentStock: formData.currentStock,
          safeStock: formData.safeStock,
          unit: formData.unit,
          location: formData.location,
          status: formData.status,
        };
        const updatedInventory = await inventoryApi.update(editingId, updateDto);
        setInventories((prev) =>
          prev.map((inventory) => (inventory.id === editingId ? updatedInventory : inventory))
        );
      } else {
        // 등록
        const createDto: CreateInventoryDto = {
          itemCode: formData.itemCode,
          itemName: formData.itemName,
          currentStock: formData.currentStock,
          safeStock: formData.safeStock,
          unit: formData.unit,
          location: formData.location,
          status: formData.status,
        };
        const newInventory = await inventoryApi.create(createDto);
        setInventories((prev) => [...prev, newInventory]);
      }
      handleCloseModal();
    } catch (err) {
      setError(editingId ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
      console.error('Failed to save inventory:', err);
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
        await inventoryApi.remove(deleteTargetId);
        setInventories((prev) => prev.filter((inventory) => inventory.id !== deleteTargetId));
        setDeleteTargetId(null);
      } catch (err) {
        setError('삭제에 실패했습니다.');
        console.error('Failed to delete inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteConfirm(false);
  };


  const getStockStatus = (current: number, safe: number) => {
    if (current > safe) return '안전';
    return '부족';
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
        <h1 className="text-slate-700 text-3xl font-bold">재고정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="품목코드, 품목명, 보관위치 검색..."
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

      {/* 재고 리스트 테이블 */}
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
            key: 'status',
            label: '상태',
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
        data={filteredInventories}
        emptyMessage={inventories.length === 0 ? '등록된 재고정보가 없습니다.' : '검색 결과가 없습니다.'}
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="재고정보"
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '재고 수정' : '재고 등록'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    품목코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: ITM-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    품목명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="품목명을 입력하세요"
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
                    안전재고 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="safeStock"
                    value={formData.safeStock || ''}
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
                    단위 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="개">개</option>
                    <option value="박스">박스</option>
                    <option value="팩">팩</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보관위치 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: A-1-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상태 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="정상">정상</option>
                    <option value="보관중">보관중</option>
                    <option value="폐기">폐기</option>
                  </select>
                </div>
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

export default InventoryPage;
