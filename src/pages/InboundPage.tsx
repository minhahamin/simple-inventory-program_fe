import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';

interface Inbound {
  id: string;
  inboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  memo: string;
}

const InboundPage: React.FC = () => {
  const [inbounds, setInbounds] = useState<Inbound[]>([
    { id: '1', inboundDate: '2024-01-15', itemCode: 'ITM-001', itemName: '노트북', quantity: 10, unitPrice: 1200000, supplier: '삼성전자', memo: '신규 입고' },
    { id: '2', inboundDate: '2024-01-16', itemCode: 'ITM-002', itemName: '마우스', quantity: 50, unitPrice: 25000, supplier: '로지텍', memo: '재고 보충' },
    { id: '3', inboundDate: '2024-01-17', itemCode: 'ITM-003', itemName: '키보드', quantity: 30, unitPrice: 85000, supplier: '코리아', memo: '정기 입고' },
    { id: '4', inboundDate: '2024-01-18', itemCode: 'ITM-004', itemName: '모니터', quantity: 20, unitPrice: 350000, supplier: 'LG전자', memo: '신규 입고' },
    { id: '5', inboundDate: '2024-01-19', itemCode: 'ITM-005', itemName: '의자', quantity: 15, unitPrice: 250000, supplier: '시디즈', memo: '재고 보충' },
    { id: '6', inboundDate: '2024-01-20', itemCode: 'ITM-006', itemName: '책상', quantity: 12, unitPrice: 180000, supplier: '이케아', memo: '신규 입고' },
    { id: '7', inboundDate: '2024-01-21', itemCode: 'ITM-007', itemName: '스피커', quantity: 25, unitPrice: 150000, supplier: '하만카돈', memo: '정기 입고' },
    { id: '8', inboundDate: '2024-01-22', itemCode: 'ITM-008', itemName: '헤드셋', quantity: 30, unitPrice: 120000, supplier: '소니', memo: '재고 보충' },
    { id: '9', inboundDate: '2024-01-23', itemCode: 'ITM-009', itemName: '웹캠', quantity: 20, unitPrice: 80000, supplier: '로지텍', memo: '신규 입고' },
    { id: '10', inboundDate: '2024-01-24', itemCode: 'ITM-010', itemName: '마이크', quantity: 15, unitPrice: 95000, supplier: '블루예티', memo: '정기 입고' },
    { id: '11', inboundDate: '2024-01-25', itemCode: 'ITM-011', itemName: '램프', quantity: 40, unitPrice: 45000, supplier: '필립스', memo: '재고 보충' },
    { id: '12', inboundDate: '2024-01-26', itemCode: 'ITM-012', itemName: '파일함', quantity: 50, unitPrice: 35000, supplier: '오피스플러스', memo: '신규 입고' },
    { id: '13', inboundDate: '2024-01-27', itemCode: 'ITM-013', itemName: '프린터', quantity: 8, unitPrice: 450000, supplier: 'HP', memo: '정기 입고' },
    { id: '14', inboundDate: '2024-01-28', itemCode: 'ITM-014', itemName: '복사기', quantity: 5, unitPrice: 1200000, supplier: '캐논', memo: '신규 입고' },
    { id: '15', inboundDate: '2024-01-29', itemCode: 'ITM-015', itemName: '스캐너', quantity: 10, unitPrice: 280000, supplier: '이pson', memo: '재고 보충' },
    { id: '16', inboundDate: '2024-01-30', itemCode: 'ITM-016', itemName: '서버', quantity: 3, unitPrice: 3500000, supplier: '델', memo: '신규 입고' },
    { id: '17', inboundDate: '2024-02-01', itemCode: 'ITM-017', itemName: '라우터', quantity: 15, unitPrice: 180000, supplier: '시스코', memo: '정기 입고' },
    { id: '18', inboundDate: '2024-02-02', itemCode: 'ITM-018', itemName: '스위치', quantity: 12, unitPrice: 250000, supplier: '넷기어', memo: '재고 보충' },
    { id: '19', inboundDate: '2024-02-03', itemCode: 'ITM-019', itemName: '백업장치', quantity: 8, unitPrice: 550000, supplier: '시게이트', memo: '신규 입고' },
    { id: '20', inboundDate: '2024-02-04', itemCode: 'ITM-020', itemName: 'USB 메모리', quantity: 100, unitPrice: 25000, supplier: '샌디스크', memo: '정기 입고' },
    { id: '21', inboundDate: '2024-02-05', itemCode: 'ITM-021', itemName: '마우스패드', quantity: 60, unitPrice: 15000, supplier: '레이저', memo: '재고 보충' },
    { id: '22', inboundDate: '2024-02-06', itemCode: 'ITM-022', itemName: '모니터암', quantity: 18, unitPrice: 120000, supplier: '에르고텍', memo: '신규 입고' },
    { id: '23', inboundDate: '2024-02-07', itemCode: 'ITM-023', itemName: '케이블', quantity: 80, unitPrice: 15000, supplier: '벨킨', memo: '정기 입고' },
    { id: '24', inboundDate: '2024-02-08', itemCode: 'ITM-024', itemName: '어댑터', quantity: 35, unitPrice: 35000, supplier: '애플', memo: '재고 보충' },
    { id: '25', inboundDate: '2024-02-09', itemCode: 'ITM-025', itemName: '충전기', quantity: 45, unitPrice: 45000, supplier: '삼성', memo: '신규 입고' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [formData, setFormData] = useState<Omit<Inbound, 'id'>>({
    inboundDate: '',
    itemCode: '',
    itemName: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
    memo: '',
  });

  const filteredInbounds = inbounds.filter((inbound) => {
    const matchesSearch =
      inbound.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inbound.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inbound.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || inbound.inboundDate === searchDate;
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const inbound = inbounds.find((inbound) => inbound.id === id);
    if (inbound) {
      setEditingId(id);
      setFormData({
        inboundDate: inbound.inboundDate,
        itemCode: inbound.itemCode,
        itemName: inbound.itemName,
        quantity: inbound.quantity,
        unitPrice: inbound.unitPrice,
        supplier: inbound.supplier,
        memo: inbound.memo,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      inboundDate: '',
      itemCode: '',
      itemName: '',
      quantity: 0,
      unitPrice: 0,
      supplier: '',
      memo: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInbounds((prev) =>
        prev.map((inbound) => (inbound.id === editingId ? { ...inbound, ...formData } : inbound))
      );
    } else {
      const newInbound: Inbound = {
        id: Date.now().toString(),
        ...formData,
      };
      setInbounds((prev) => [...prev, newInbound]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setInbounds((prev) => prev.filter((inbound) => inbound.id !== id));
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">입고정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="품목코드, 품목명, 공급처 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <DatePicker
            value={searchDate}
            onChange={setSearchDate}
            placeholder="입고일 검색"
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

      {/* 입고 리스트 테이블 */}
      <DataTable
        columns={[
          {
            key: 'inboundDate',
            label: '입고일',
            render: (item) => (
              <span className="font-medium text-gray-900">{item.inboundDate}</span>
            ),
          },
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
            key: 'quantity',
            label: '수량',
            render: (item) => (
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">
                {item.quantity.toLocaleString()}
              </span>
            ),
          },
          {
            key: 'unitPrice',
            label: '단가',
            render: (item) => (
              <span className="text-gray-700 font-medium">{item.unitPrice.toLocaleString()}원</span>
            ),
          },
          {
            key: 'supplier',
            label: '공급처',
            render: (item) => (
              <span className="text-gray-700">{item.supplier}</span>
            ),
          },
          {
            key: 'memo',
            label: '비고',
            render: (item) => (
              <span className="text-gray-600 max-w-xs truncate block">{item.memo || '-'}</span>
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
        data={filteredInbounds}
        emptyMessage={inbounds.length === 0 ? '등록된 입고정보가 없습니다.' : '검색 결과가 없습니다.'}
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="입고정보"
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '입고 수정' : '입고 등록'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    입고일 <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.inboundDate}
                    onChange={(date) => setFormData((prev) => ({ ...prev, inboundDate: date }))}
                    required
                  />
                </div>

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
                    수량 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ''}
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
                    공급처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="공급처를 입력하세요"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비고
                </label>
                <textarea
                  name="memo"
                  value={formData.memo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비고를 입력하세요"
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

export default InboundPage;
