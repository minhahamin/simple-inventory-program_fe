import React, { useState, useEffect } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import { usersApi, User, CreateUserDto, UpdateUserDto } from '../api/usersApi';

const PermissionPage: React.FC = () => {
  const [permissions, setPermissions] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    userId: '',
    userName: '',
    role: '',
    department: '',
    email: '',
    status: '활성',
    description: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.findAll();
      setPermissions(data);
    } catch (err) {
      setError('권한정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const permission = permissions.find((permission) => permission.id === id);
    if (permission) {
      setEditingId(id);
      setFormData({
        userId: permission.userId,
        userName: permission.userName,
        role: permission.role,
        department: permission.department,
        email: permission.email,
        status: permission.status,
        description: permission.description,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      userId: '',
      userName: '',
      role: '',
      department: '',
      email: '',
      status: '활성',
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingId) {
        // 수정
        const updateDto: UpdateUserDto = {
          userId: formData.userId,
          userName: formData.userName,
          role: formData.role,
          department: formData.department,
          email: formData.email,
          status: formData.status,
          description: formData.description,
        };
        const updatedUser = await usersApi.update(editingId, updateDto);
        setPermissions((prev) =>
          prev.map((permission) => (permission.id === editingId ? updatedUser : permission))
        );
      } else {
        // 등록
        const createDto: CreateUserDto = {
          userId: formData.userId,
          userName: formData.userName,
          role: formData.role,
          department: formData.department,
          email: formData.email,
          status: formData.status,
          description: formData.description,
        };
        const newUser = await usersApi.create(createDto);
        setPermissions((prev) => [...prev, newUser]);
      }
      handleCloseModal();
    } catch (err) {
      setError(editingId ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
      console.error('Failed to save user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await usersApi.remove(deleteTargetId);
      setPermissions((prev) => prev.filter((permission) => permission.id !== deleteTargetId));
      setDeleteTargetId(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('삭제에 실패했습니다.');
      console.error('Failed to delete user:', err);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          처리 중...
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">권한정보</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="사용자ID, 사용자명, 이메일, 부서, 권한등급 검색..."
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

      {/* 권한 리스트 테이블 */}
      <DataTable
        columns={[
          {
            key: 'userId',
            label: '사용자ID',
            render: (item) => (
              <span className="font-semibold text-gray-900">{item.userId}</span>
            ),
          },
          {
            key: 'userName',
            label: '사용자명',
            render: (item) => <span className="text-gray-700 font-medium">{item.userName}</span>,
          },
          {
            key: 'role',
            label: '권한등급',
            render: (item) => (
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                {item.role}
              </span>
            ),
          },
          {
            key: 'department',
            label: '부서',
            render: (item) => (
              <span className="text-gray-700">{item.department}</span>
            ),
          },
          {
            key: 'email',
            label: '이메일',
            render: (item) => (
              <span className="text-gray-700">{item.email}</span>
            ),
          },
          {
            key: 'status',
            label: '상태',
            render: (item) => (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === '활성'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.status}
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
        data={filteredPermissions}
        emptyMessage={permissions.length === 0 ? '등록된 권한정보가 없습니다.' : '검색 결과가 없습니다.'}
        onDelete={handleDelete}
        keyExtractor={(item) => item.id}
        fileName="권한정보"
      />

      {/* 등록 모달 */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? '권한 수정' : '권한 등록'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용자ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: USER-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용자명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="사용자명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    권한등급 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="관리자">관리자</option>
                    <option value="일반사용자">일반사용자</option>
                    <option value="조회전용">조회전용</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    부서 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="부서를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
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
                    <option value="활성">활성</option>
                    <option value="비활성">비활성</option>
                  </select>
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
                  placeholder="권한에 대한 설명을 입력하세요"
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

export default PermissionPage;
