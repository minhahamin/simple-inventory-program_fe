import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';
import ConfirmModal from '../components/ConfirmModal';

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
    { id: '1', itemCode: 'ITM-001', itemName: '노트북', unitPrice: 1200000, unit: '개', category: '전자제품', description: '고성능 노트북 컴퓨터', registeredDate: '2024-01-10' },
    { id: '2', itemCode: 'ITM-002', itemName: '마우스', unitPrice: 25000, unit: '개', category: '전자제품', description: '무선 마우스', registeredDate: '2024-01-11' },
    { id: '3', itemCode: 'ITM-003', itemName: '키보드', unitPrice: 85000, unit: '개', category: '전자제품', description: '기계식 키보드', registeredDate: '2024-01-12' },
    { id: '4', itemCode: 'ITM-004', itemName: '모니터', unitPrice: 350000, unit: '개', category: '전자제품', description: '27인치 4K 모니터', registeredDate: '2024-01-13' },
    { id: '5', itemCode: 'ITM-005', itemName: '의자', unitPrice: 250000, unit: '개', category: '가구', description: '사무용 의자', registeredDate: '2024-01-14' },
    { id: '6', itemCode: 'ITM-006', itemName: '책상', unitPrice: 180000, unit: '개', category: '가구', description: '사무용 책상', registeredDate: '2024-01-15' },
    { id: '7', itemCode: 'ITM-007', itemName: '스피커', unitPrice: 150000, unit: '개', category: '전자제품', description: '블루투스 스피커', registeredDate: '2024-01-16' },
    { id: '8', itemCode: 'ITM-008', itemName: '헤드셋', unitPrice: 120000, unit: '개', category: '전자제품', description: '무선 헤드셋', registeredDate: '2024-01-17' },
    { id: '9', itemCode: 'ITM-009', itemName: '웹캠', unitPrice: 80000, unit: '개', category: '전자제품', description: 'HD 웹캠', registeredDate: '2024-01-18' },
    { id: '10', itemCode: 'ITM-010', itemName: '마이크', unitPrice: 95000, unit: '개', category: '전자제품', description: 'USB 마이크', registeredDate: '2024-01-19' },
    { id: '11', itemCode: 'ITM-011', itemName: '램프', unitPrice: 45000, unit: '개', category: '가구', description: 'LED 데스크 램프', registeredDate: '2024-01-20' },
    { id: '12', itemCode: 'ITM-012', itemName: '파일함', unitPrice: 35000, unit: '개', category: '사무용품', description: '서류 보관함', registeredDate: '2024-01-21' },
    { id: '13', itemCode: 'ITM-013', itemName: '프린터', unitPrice: 450000, unit: '개', category: '전자제품', description: '레이저 프린터', registeredDate: '2024-01-22' },
    { id: '14', itemCode: 'ITM-014', itemName: '복사기', unitPrice: 1200000, unit: '개', category: '전자제품', description: '다기능 복사기', registeredDate: '2024-01-23' },
    { id: '15', itemCode: 'ITM-015', itemName: '스캐너', unitPrice: 280000, unit: '개', category: '전자제품', description: '문서 스캐너', registeredDate: '2024-01-24' },
    { id: '16', itemCode: 'ITM-016', itemName: '서버', unitPrice: 3500000, unit: '개', category: '전자제품', description: '서버 컴퓨터', registeredDate: '2024-01-25' },
    { id: '17', itemCode: 'ITM-017', itemName: '라우터', unitPrice: 180000, unit: '개', category: '전자제품', description: '무선 라우터', registeredDate: '2024-01-26' },
    { id: '18', itemCode: 'ITM-018', itemName: '스위치', unitPrice: 250000, unit: '개', category: '전자제품', description: '네트워크 스위치', registeredDate: '2024-01-27' },
    { id: '19', itemCode: 'ITM-019', itemName: '백업장치', unitPrice: 550000, unit: '개', category: '전자제품', description: '외장 하드디스크', registeredDate: '2024-01-28' },
    { id: '20', itemCode: 'ITM-020', itemName: 'USB 메모리', unitPrice: 25000, unit: '개', category: '전자제품', description: '64GB USB', registeredDate: '2024-01-29' },
    { id: '21', itemCode: 'ITM-021', itemName: '마우스패드', unitPrice: 15000, unit: '개', category: '사무용품', description: '게이밍 마우스패드', registeredDate: '2024-01-30' },
    { id: '22', itemCode: 'ITM-022', itemName: '모니터암', unitPrice: 120000, unit: '개', category: '가구', description: '듀얼 모니터암', registeredDate: '2024-02-01' },
    { id: '23', itemCode: 'ITM-023', itemName: '케이블', unitPrice: 15000, unit: '개', category: '전자제품', description: 'HDMI 케이블', registeredDate: '2024-02-02' },
    { id: '24', itemCode: 'ITM-024', itemName: '어댑터', unitPrice: 35000, unit: '개', category: '전자제품', description: 'USB-C 어댑터', registeredDate: '2024-02-03' },
    { id: '25', itemCode: 'ITM-025', itemName: '충전기', unitPrice: 45000, unit: '개', category: '전자제품', description: '고속 충전기', registeredDate: '2024-02-04' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
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
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
    setShowDeleteConfirm(false);
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
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="품목정보"
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

export default ItemsPage;
