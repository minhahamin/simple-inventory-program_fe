import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';

interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  unitPrice: number;
  unit: string;
  category: string;
  description: string;
  registeredDate: string;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      itemCode: 'ITM-001',
      itemName: '노트북',
      unitPrice: 1200000,
      unit: '개',
      category: '전자제품',
      description: '고성능 노트북 컴퓨터',
      registeredDate: '2024-01-10',
    },
    {
      id: '2',
      itemCode: 'ITM-002',
      itemName: '마우스',
      unitPrice: 25000,
      unit: '개',
      category: '전자제품',
      description: '무선 마우스',
      registeredDate: '2024-01-11',
    },
    {
      id: '3',
      itemCode: 'ITM-003',
      itemName: '키보드',
      unitPrice: 85000,
      unit: '개',
      category: '전자제품',
      description: '기계식 키보드',
      registeredDate: '2024-01-12',
    },
    {
      id: '4',
      itemCode: 'ITM-004',
      itemName: '모니터',
      unitPrice: 350000,
      unit: '개',
      category: '전자제품',
      description: '27인치 4K 모니터',
      registeredDate: '2024-01-13',
    },
    {
      id: '5',
      itemCode: 'ITM-005',
      itemName: '의자',
      unitPrice: 250000,
      unit: '개',
      category: '가구',
      description: '사무용 의자',
      registeredDate: '2024-01-14',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    itemCode: '',
    itemName: '',
    unitPrice: 0,
    unit: '',
    category: '',
    description: '',
    registeredDate: '',
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || item.registeredDate === searchDate;
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setEditingId(id);
      setFormData({
        itemCode: item.itemCode,
        itemName: item.itemName,
        unitPrice: item.unitPrice,
        unit: item.unit,
        category: item.category,
        description: item.description,
        registeredDate: item.registeredDate,
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
      unitPrice: 0,
      unit: '',
      category: '',
      description: '',
      registeredDate: '',
    });
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unitPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        ...formData,
      };
      setItems((prev) => [...prev, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">품목정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="품목코드, 품목명, 카테고리 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <DatePicker
            value={searchDate}
            onChange={setSearchDate}
            placeholder="등록일 검색"
            className="w-48"
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

      {/* 품목 리스트 테이블 */}
      <DataTable
        columns={[
          {
            key: 'itemCode',
            label: '품목코드',
            render: (item) => (
              <span className="font-semibold text-gray-900">{item.itemCode}</span>
            ),
          },
          {
            key: 'itemName',
            label: '품목명',
            render: (item) => <span className="text-gray-700">{item.itemName}</span>,
          },
          {
            key: 'unitPrice',
            label: '단가',
            render: (item) => (
              <span className="text-gray-700 font-medium">{item.unitPrice.toLocaleString()}원</span>
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
            key: 'category',
            label: '카테고리',
            render: (item) => (
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                {item.category}
              </span>
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
        data={filteredItems}
        emptyMessage={items.length === 0 ? '등록된 품목이 없습니다.' : '검색 결과가 없습니다.'}
        keyExtractor={(item) => item.id}
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '품목 수정' : '품목 등록'}
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
                    단가 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
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
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 전자제품, 식품 등"
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
                    placeholder="품목에 대한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    등록일 <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.registeredDate}
                    onChange={(date) => setFormData((prev) => ({ ...prev, registeredDate: date }))}
                    required
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

export default ItemsPage;
