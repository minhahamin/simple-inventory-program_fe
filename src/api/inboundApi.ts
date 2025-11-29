import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Inbound {
  id: string;
  inboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  memo: string;
}

export interface CreateInboundDto {
  inboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  memo?: string;
}

export interface UpdateInboundDto {
  inboundDate?: string;
  itemCode?: string;
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
  supplier?: string;
  memo?: string;
}

export const inboundApi = {
  // 모든 입고 조회
  findAll: async (): Promise<Inbound[]> => {
    const response = await api.get<Inbound[]>('/inbound');
    return response.data;
  },

  // 특정 입고 조회
  findOne: async (id: string): Promise<Inbound> => {
    const response = await api.get<Inbound>(`/inbound/${id}`);
    return response.data;
  },

  // 입고 생성
  create: async (createInboundDto: CreateInboundDto): Promise<Inbound> => {
    const response = await api.post<Inbound>('/inbound', createInboundDto);
    return response.data;
  },

  // 입고 수정
  update: async (id: string, updateInboundDto: UpdateInboundDto): Promise<Inbound> => {
    const response = await api.patch<Inbound>(`/inbound/${id}`, updateInboundDto);
    return response.data;
  },

  // 입고 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/inbound/${id}`);
  },
};

