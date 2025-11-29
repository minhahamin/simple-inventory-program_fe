import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  unitPrice: number;
  unit: string;
  category: string;
  description: string;
  registeredDate?: string;
}

export interface CreateItemDto {
  itemCode?: string;
  itemName: string;
  unitPrice: number;
  unit: string;
  category: string;
  description: string;
  registeredDate?: string;
}

export interface UpdateItemDto {
  itemCode?: string;
  itemName?: string;
  unitPrice?: number;
  unit?: string;
  category?: string;
  description?: string;
  registeredDate?: string;
}

export const itemsApi = {
  // 모든 품목 조회
  findAll: async (): Promise<Item[]> => {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },

  // 특정 품목 조회
  findOne: async (id: string): Promise<Item> => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  // 품목 생성
  create: async (createItemDto: CreateItemDto): Promise<Item> => {
    const response = await api.post<Item>('/items', createItemDto);
    return response.data;
  },

  // 품목 수정
  update: async (id: string, updateItemDto: UpdateItemDto): Promise<Item> => {
    const response = await api.patch<Item>(`/items/${id}`, updateItemDto);
    return response.data;
  },

  // 품목 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

