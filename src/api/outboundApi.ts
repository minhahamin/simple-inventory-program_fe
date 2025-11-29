import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Outbound {
  id: string;
  outboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  customer: string;
  memo: string;
}

export interface CreateOutboundDto {
  outboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  customer: string;
  memo?: string;
}

export interface UpdateOutboundDto {
  outboundDate?: string;
  itemCode?: string;
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
  customer?: string;
  memo?: string;
}

export const outboundApi = {
  // 모든 출고 조회
  findAll: async (): Promise<Outbound[]> => {
    const response = await api.get<Outbound[]>('/outbound');
    return response.data;
  },

  // 특정 출고 조회
  findOne: async (id: string): Promise<Outbound> => {
    const response = await api.get<Outbound>(`/outbound/${id}`);
    return response.data;
  },

  // 출고 생성
  create: async (createOutboundDto: CreateOutboundDto): Promise<Outbound> => {
    const response = await api.post<Outbound>('/outbound', createOutboundDto);
    return response.data;
  },

  // 출고 수정
  update: async (id: string, updateOutboundDto: UpdateOutboundDto): Promise<Outbound> => {
    const response = await api.patch<Outbound>(`/outbound/${id}`, updateOutboundDto);
    return response.data;
  },

  // 출고 삭제
  remove: async (id: string): Promise<void> => {
    await api.delete(`/outbound/${id}`);
  },
};

