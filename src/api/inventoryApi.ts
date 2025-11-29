import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Inventory {
  id: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  safeStock: number;
  unit: string;
  location: string;
  status: string;
  stockStatus?: string;
  registeredDate?: string;
  lastInboundDate?: string;
  lastOutboundDate?: string;
}

export interface CreateInventoryDto {
  itemCode: string;
  itemName: string;
  currentStock: number;
  safeStock: number;
  unit: string;
  location: string;
  status: string;
}

export interface UpdateInventoryDto {
  itemCode?: string;
  itemName?: string;
  currentStock?: number;
  safeStock?: number;
  unit?: string;
  location?: string;
  status?: string;
}

export const inventoryApi = {
  // 모든 재고 조회
  findAll: async (): Promise<Inventory[]> => {
    const response = await api.get<Inventory[]>('/inventory');
    return response.data;
  },

  // 특정 재고 조회
  findOne: async (id: string): Promise<Inventory> => {
    const response = await api.get<Inventory>(`/inventory/${id}`);
    return response.data;
  },

  // 재고 생성
  create: async (createInventoryDto: CreateInventoryDto): Promise<Inventory> => {
    const response = await api.post<Inventory>('/inventory', createInventoryDto);
    return response.data;
  },

  // 재고 수정
  update: async (id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> => {
    const response = await api.patch<Inventory>(`/inventory/${id}`, updateInventoryDto);
    return response.data;
  },

  // 재고 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },
};

