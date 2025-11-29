import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  location: string;
  manager: string;
  phone: string;
  description: string;
}

export interface CreateWarehouseDto {
  warehouseCode?: string;
  warehouseName: string;
  location: string;
  manager: string;
  phone: string;
  description?: string;
}

export interface UpdateWarehouseDto {
  warehouseCode?: string;
  warehouseName?: string;
  location?: string;
  manager?: string;
  phone?: string;
  description?: string;
}

export const warehouseApi = {
  // 모든 창고 조회
  findAll: async (): Promise<Warehouse[]> => {
    const response = await api.get<Warehouse[]>('/warehouse');
    return response.data;
  },

  // 특정 창고 조회
  findOne: async (id: string): Promise<Warehouse> => {
    const response = await api.get<Warehouse>(`/warehouse/${id}`);
    return response.data;
  },

  // 창고 생성
  create: async (createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> => {
    const response = await api.post<Warehouse>('/warehouse', createWarehouseDto);
    return response.data;
  },

  // 창고 수정
  update: async (id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> => {
    const response = await api.patch<Warehouse>(`/warehouse/${id}`, updateWarehouseDto);
    return response.data;
  },

  // 창고 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/warehouse/${id}`);
  },
};

