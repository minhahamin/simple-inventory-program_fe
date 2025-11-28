import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';

interface Inventory {
  id: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  safeStock: number;
  unit: string;
  location: string;
  status: string;
  registeredDate: string;
}

const InventoryPage: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([
    { id: '1', itemCode: 'ITM-001', itemName: '노트북', currentStock: 5, safeStock: 10, unit: '개', location: 'A-1-1', status: '정상', registeredDate: '2024-01-10' },
    { id: '2', itemCode: 'ITM-002', itemName: '마우스', currentStock: 30, safeStock: 20, unit: '개', location: 'A-1-2', status: '정상', registeredDate: '2024-01-11' },
    { id: '3', itemCode: 'ITM-003', itemName: '키보드', currentStock: 20, safeStock: 15, unit: '개', location: 'A-1-3', status: '정상', registeredDate: '2024-01-12' },
    { id: '4', itemCode: 'ITM-004', itemName: '모니터', currentStock: 12, safeStock: 10, unit: '개', location: 'A-2-1', status: '정상', registeredDate: '2024-01-13' },
    { id: '5', itemCode: 'ITM-005', itemName: '의자', currentStock: 10, safeStock: 5, unit: '개', location: 'B-1-1', status: '정상', registeredDate: '2024-01-14' },
    { id: '6', itemCode: 'ITM-006', itemName: '책상', currentStock: 8, safeStock: 5, unit: '개', location: 'B-1-2', status: '정상', registeredDate: '2024-01-15' },
    { id: '7', itemCode: 'ITM-007', itemName: '스피커', currentStock: 15, safeStock: 10, unit: '개', location: 'A-2-2', status: '정상', registeredDate: '2024-01-16' },
    { id: '8', itemCode: 'ITM-008', itemName: '헤드셋', currentStock: 18, safeStock: 15, unit: '개', location: 'A-2-3', status: '정상', registeredDate: '2024-01-17' },
    { id: '9', itemCode: 'ITM-009', itemName: '웹캠', currentStock: 12, safeStock: 10, unit: '개', location: 'A-3-1', status: '정상', registeredDate: '2024-01-18' },
    { id: '10', itemCode: 'ITM-010', itemName: '마이크', currentStock: 9, safeStock: 8, unit: '개', location: 'A-3-2', status: '정상', registeredDate: '2024-01-19' },
    { id: '11', itemCode: 'ITM-011', itemName: '램프', currentStock: 25, safeStock: 20, unit: '개', location: 'B-2-1', status: '정상', registeredDate: '2024-01-20' },
    { id: '12', itemCode: 'ITM-012', itemName: '파일함', currentStock: 30, safeStock: 25, unit: '개', location: 'B-2-2', status: '정상', registeredDate: '2024-01-21' },
    { id: '13', itemCode: 'ITM-013', itemName: '프린터', currentStock: 6, safeStock: 5, unit: '개', location: 'C-1-1', status: '정상', registeredDate: '2024-01-22' },
    { id: '14', itemCode: 'ITM-014', itemName: '복사기', currentStock: 4, safeStock: 3, unit: '개', location: 'C-1-2', status: '정상', registeredDate: '2024-01-23' },
    { id: '15', itemCode: 'ITM-015', itemName: '스캐너', currentStock: 7, safeStock: 5, unit: '개', location: 'C-1-3', status: '정상', registeredDate: '2024-01-24' },
    { id: '16', itemCode: 'ITM-016', itemName: '서버', currentStock: 2, safeStock: 2, unit: '개', location: 'C-2-1', status: '정상', registeredDate: '2024-01-25' },
    { id: '17', itemCode: 'ITM-017', itemName: '라우터', currentStock: 10, safeStock: 8, unit: '개', location: 'C-2-2', status: '정상', registeredDate: '2024-01-26' },
    { id: '18', itemCode: 'ITM-018', itemName: '스위치', currentStock: 8, safeStock: 6, unit: '개', location: 'C-2-3', status: '정상', registeredDate: '2024-01-27' },
    { id: '19', itemCode: 'ITM-019', itemName: '백업장치', currentStock: 6, safeStock: 5, unit: '개', location: 'C-3-1', status: '정상', registeredDate: '2024-01-28' },
    { id: '20', itemCode: 'ITM-020', itemName: 'USB 메모리', currentStock: 70, safeStock: 50, unit: '개', location: 'D-1-1', status: '정상', registeredDate: '2024-01-29' },
    { id: '21', itemCode: 'ITM-021', itemName: '마우스패드', currentStock: 35, safeStock: 30, unit: '개', location: 'D-1-2', status: '정상', registeredDate: '2024-01-30' },
    { id: '22', itemCode: 'ITM-022', itemName: '모니터암', currentStock: 12, safeStock: 10, unit: '개', location: 'D-2-1', status: '정상', registeredDate: '2024-02-01' },
    { id: '23', itemCode: 'ITM-023', itemName: '케이블', currentStock: 40, safeStock: 30, unit: '개', location: 'D-2-2', status: '정상', registeredDate: '2024-02-02' },
    { id: '24', itemCode: 'ITM-024', itemName: '어댑터', currentStock: 23, safeStock: 20, unit: '개', location: 'D-2-3', status: '정상', registeredDate: '2024-02-03' },
    { id: '25', itemCode: 'ITM-025', itemName: '충전기', currentStock: 27, safeStock: 25, unit: '개', location: 'D-3-1', status: '정상', registeredDate: '2024-02-04' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [formData, setFormData] = useState<Omit<Inventory, 'id'>>({
    itemCode: '',
    itemName: '',
    currentStock: 0,
    safeStock: 0,
    unit: '',
    location: '',
    status: '정상',
    registeredDate: '',
  });

  const filteredInventories = inventories.filter((inventory) => {
    const matchesSearch =
      inventory.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || inventory.registeredDate === searchDate;
    return matchesSearch && matchesDate;
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
        registeredDate: inventory.registeredDate,
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
      registeredDate: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'safeStock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInventories((prev) =>
        prev.map((inventory) => (inventory.id === editingId ? { ...inventory, ...formData } : inventory))
      );
    } else {
      const newInventory: Inventory = {
        id: Date.now().toString(),
        ...formData,
      };
      setInventories((prev) => [...prev, newInventory]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setInventories((prev) => prev.filter((inventory) => inventory.id !== id));
    }
  };


  const getStockStatus = (current: number, safe: number) => {
    if (current > safe) return '안전';
    return '부족';
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
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
          <DatePicker
            value={searchDate}
            onChange={setSearchDate}
            placeholder="등록일 검색"
            className="w-64"
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
            key: 'registeredDate',
            label: '등록일',
            render: (item) => (
              <span className="text-gray-700">{item.registeredDate}</span>
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
        data={filteredInventories}
        emptyMessage={inventories.length === 0 ? '등록된 재고정보가 없습니다.' : '검색 결과가 없습니다.'}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    등록일 <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.registeredDate}
                    onChange={(date) => setFormData((prev) => ({ ...prev, registeredDate: date }))}
                    required
                    className="w-full"
                  />
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
    </div>
  );
};

export default InventoryPage;
