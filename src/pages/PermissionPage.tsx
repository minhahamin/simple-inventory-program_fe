import React, { useState } from 'react';
import DraggableModal from '../components/DraggableModal';
import DataTable from '../components/DataTable';

interface Permission {
  id: string;
  userId: string;
  userName: string;
  role: string;
  department: string;
  email: string;
  status: string;
  description: string;
}

const PermissionPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: '1', userId: 'admin', userName: '관리자', role: '관리자', department: 'IT팀', email: 'admin@company.com', status: '활성', description: '시스템 관리자' },
    { id: '2', userId: 'user001', userName: '김철수', role: '일반사용자', department: '영업팀', email: 'kim@company.com', status: '활성', description: '영업 담당자' },
    { id: '3', userId: 'user002', userName: '이영희', role: '일반사용자', department: '구매팀', email: 'lee@company.com', status: '활성', description: '구매 담당자' },
    { id: '4', userId: 'user003', userName: '박민수', role: '운영자', department: '물류팀', email: 'park@company.com', status: '활성', description: '물류 운영자' },
    { id: '5', userId: 'user004', userName: '최지영', role: '일반사용자', department: '회계팀', email: 'choi@company.com', status: '비활성', description: '회계 담당자' },
    { id: '6', userId: 'user005', userName: '정수진', role: '일반사용자', department: '마케팅팀', email: 'jung@company.com', status: '활성', description: '마케팅 담당자' },
    { id: '7', userId: 'user006', userName: '강호영', role: '운영자', department: '물류팀', email: 'kang@company.com', status: '활성', description: '물류 운영자' },
    { id: '8', userId: 'user007', userName: '윤서연', role: '일반사용자', department: '인사팀', email: 'yoon@company.com', status: '활성', description: '인사 담당자' },
    { id: '9', userId: 'user008', userName: '장민호', role: '일반사용자', department: '영업팀', email: 'jang@company.com', status: '활성', description: '영업 담당자' },
    { id: '10', userId: 'user009', userName: '임지훈', role: '일반사용자', department: '구매팀', email: 'lim@company.com', status: '활성', description: '구매 담당자' },
    { id: '11', userId: 'user010', userName: '한소영', role: '운영자', department: '물류팀', email: 'han@company.com', status: '활성', description: '물류 운영자' },
    { id: '12', userId: 'user011', userName: '오준혁', role: '일반사용자', department: '회계팀', email: 'oh@company.com', status: '활성', description: '회계 담당자' },
    { id: '13', userId: 'user012', userName: '서미래', role: '일반사용자', department: '마케팅팀', email: 'seo@company.com', status: '활성', description: '마케팅 담당자' },
    { id: '14', userId: 'user013', userName: '신동욱', role: '일반사용자', department: 'IT팀', email: 'shin@company.com', status: '활성', description: 'IT 담당자' },
    { id: '15', userId: 'user014', userName: '유하늘', role: '일반사용자', department: '영업팀', email: 'yu@company.com', status: '비활성', description: '영업 담당자' },
    { id: '16', userId: 'user015', userName: '조성민', role: '운영자', department: '물류팀', email: 'cho@company.com', status: '활성', description: '물류 운영자' },
    { id: '17', userId: 'user016', userName: '허지은', role: '일반사용자', department: '구매팀', email: 'heo@company.com', status: '활성', description: '구매 담당자' },
    { id: '18', userId: 'user017', userName: '남도현', role: '일반사용자', department: '회계팀', email: 'nam@company.com', status: '활성', description: '회계 담당자' },
    { id: '19', userId: 'user018', userName: '문수빈', role: '일반사용자', department: '마케팅팀', email: 'moon@company.com', status: '활성', description: '마케팅 담당자' },
    { id: '20', userId: 'user019', userName: '양태영', role: '일반사용자', department: '인사팀', email: 'yang@company.com', status: '활성', description: '인사 담당자' },
    { id: '21', userId: 'user020', userName: '배현우', role: '운영자', department: '물류팀', email: 'bae@company.com', status: '활성', description: '물류 운영자' },
    { id: '22', userId: 'user021', userName: '백지혜', role: '일반사용자', department: '영업팀', email: 'baek@company.com', status: '활성', description: '영업 담당자' },
    { id: '23', userId: 'user022', userName: '송민재', role: '일반사용자', department: '구매팀', email: 'song@company.com', status: '활성', description: '구매 담당자' },
    { id: '24', userId: 'user023', userName: '권혜진', role: '일반사용자', department: 'IT팀', email: 'kwon@company.com', status: '활성', description: 'IT 담당자' },
    { id: '25', userId: 'user024', userName: '황준호', role: '일반사용자', department: '회계팀', email: 'hwang@company.com', status: '비활성', description: '회계 담당자' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Permission, 'id'>>({
    userId: '',
    userName: '',
    role: '',
    department: '',
    email: '',
    status: '활성',
    description: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPermissions((prev) =>
        prev.map((permission) => (permission.id === editingId ? { ...permission, ...formData } : permission))
      );
    } else {
      const newPermission: Permission = {
        id: Date.now().toString(),
        ...formData,
      };
      setPermissions((prev) => [...prev, newPermission]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPermissions((prev) => prev.filter((permission) => permission.id !== id));
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
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
    </div>
  );
};

export default PermissionPage;
