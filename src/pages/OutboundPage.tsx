import React, { useState, useEffect } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';
import ConfirmModal from '../components/ConfirmModal';
import { outboundApi, Outbound, CreateOutboundDto, UpdateOutboundDto } from '../api/outboundApi';

const OutboundPage: React.FC = () => {
  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Outbound, 'id'>>({
    outboundDate: '',
    itemCode: '',
    itemName: '',
    quantity: 0,
    unitPrice: 0,
    customer: '',
    memo: '',
  });

  useEffect(() => {
    fetchOutbounds();
  }, []);

  const fetchOutbounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await outboundApi.findAll();
      setOutbounds(data);
    } catch (err) {
      setError('출고정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch outbounds:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOutbounds = outbounds.filter((outbound) => {
    const matchesSearch =
      outbound.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outbound.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outbound.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !searchDate || outbound.outboundDate === searchDate;
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const outbound = outbounds.find((outbound) => outbound.id === id);
    if (outbound) {
      setEditingId(id);
      setFormData({
        outboundDate: outbound.outboundDate,
        itemCode: outbound.itemCode,
        itemName: outbound.itemName,
        quantity: outbound.quantity,
        unitPrice: outbound.unitPrice,
        customer: outbound.customer,
        memo: outbound.memo,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      outboundDate: '',
      itemCode: '',
      itemName: '',
      quantity: 0,
      unitPrice: 0,
      customer: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        // 수정
        const updateDto: UpdateOutboundDto = {
          outboundDate: formData.outboundDate,
          itemCode: formData.itemCode,
          itemName: formData.itemName,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          customer: formData.customer,
          memo: formData.memo,
        };
        const updatedOutbound = await outboundApi.update(editingId, updateDto);
        setOutbounds((prev) =>
          prev.map((outbound) => (outbound.id === editingId ? updatedOutbound : outbound))
        );
      } else {
        // 등록
        const createDto: CreateOutboundDto = {
          outboundDate: formData.outboundDate,
          itemCode: formData.itemCode,
          itemName: formData.itemName,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          customer: formData.customer,
          memo: formData.memo,
        };
        const newOutbound = await outboundApi.create(createDto);
        setOutbounds((prev) => [...prev, newOutbound]);
      }
      handleCloseModal();
    } catch (err) {
      setError(editingId ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
      console.error('Failed to save outbound:', err);
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
        await outboundApi.remove(deleteTargetId);
        setOutbounds((prev) => prev.filter((outbound) => outbound.id !== deleteTargetId));
        setDeleteTargetId(null);
      } catch (err) {
        setError('삭제에 실패했습니다.');
        console.error('Failed to delete outbound:', err);
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteConfirm(false);
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
        <h1 className="text-slate-700 text-3xl font-bold">출고정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="품목코드, 품목명, 고객 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <DatePicker
            value={searchDate}
            onChange={setSearchDate}
            placeholder="출고일 검색"
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

      {/* 출고 리스트 테이블 */}
      <DataTable
        columns={[
          {
            key: 'outboundDate',
            label: '출고일',
            render: (item) => (
              <span className="font-medium text-gray-900">{item.outboundDate}</span>
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
              <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-semibold">
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
            key: 'customer',
            label: '고객',
            render: (item) => (
              <span className="text-gray-700">{item.customer}</span>
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
        data={filteredOutbounds}
        emptyMessage={outbounds.length === 0 ? '등록된 출고정보가 없습니다.' : '검색 결과가 없습니다.'}
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="출고정보"
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '출고 수정' : '출고 등록'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    출고일 <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.outboundDate}
                    onChange={(date) => setFormData((prev) => ({ ...prev, outboundDate: date }))}
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
                    고객 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="고객명을 입력하세요"
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

export default OutboundPage;
