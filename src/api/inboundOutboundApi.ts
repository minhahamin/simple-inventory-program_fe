import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface StatusItem {
  itemCode: string;
  itemName: string;
  totalInbound: number;
  totalOutbound: number;
  netStock: number;
  inboundCount: number;
  outboundCount: number;
  lastInboundDate: string;
  lastOutboundDate: string;
}

export const inboundOutboundApi = {
  // 입출고 현황 조회 (필터링 옵션 포함)
  getStatus: async (
    itemCode?: string,
    startDate?: string,
    endDate?: string
  ): Promise<StatusItem[]> => {
    const params: Record<string, string> = {};
    if (itemCode) params.itemCode = itemCode;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<StatusItem[]>('/inbound-outbound/status', { params });
    return response.data;
  },

  // 특정 품목코드로 입출고 현황 조회
  getStatusByItemCode: async (itemCode: string): Promise<StatusItem> => {
    const response = await api.get<StatusItem>(`/inbound-outbound/status/${itemCode}`);
    return response.data;
  },
};

