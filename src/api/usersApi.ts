import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  userId: string;
  userName: string;
  role: string;
  department: string;
  email: string;
  status: string;
  description: string;
}

export interface CreateUserDto {
  userId: string;
  userName: string;
  role: string;
  department: string;
  email: string;
  status: string;
  description?: string;
}

export interface UpdateUserDto {
  userId?: string;
  userName?: string;
  role?: string;
  department?: string;
  email?: string;
  status?: string;
  description?: string;
}

export const usersApi = {
  // 모든 사용자 조회
  findAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // 특정 사용자 조회
  findOne: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // 사용자 생성
  create: async (createUserDto: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', createUserDto);
    return response.data;
  },

  // 사용자 수정
  update: async (id: string, updateUserDto: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, updateUserDto);
    return response.data;
  },

  // 사용자 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

