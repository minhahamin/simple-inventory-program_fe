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

export interface MonthlyTrendItem {
  month: string;
  inboundAmount: number;
  outboundAmount: number;
}

export interface CountComparisonItem {
  name: string;
  value: number;
  color?: string;
}

export interface CountComparisonResponse {
  inboundCount: number;
  outboundCount: number;
  inboundPercentage: number;
  outboundPercentage: number;
}

export interface TopItem {
  itemCode: string;
  itemName: string;
  totalInbound: number;
  totalOutbound: number;
  totalInboundAmount: number;
  totalOutboundAmount: number;
  netStock: number;
  inboundCount: number;
  outboundCount: number;
  lastInboundDate: string | null;
  lastOutboundDate: string | null;
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

  // 월별 입출고 추이 조회
  getMonthlyTrend: async (
    startDate?: string,
    endDate?: string
  ): Promise<MonthlyTrendItem[]> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<MonthlyTrendItem[]>('/inbound-outbound/monthly-trend', { params });
    return response.data;
  },

  // 입출고 건수 비교 조회
  getCountComparison: async (): Promise<CountComparisonResponse | CountComparisonItem[]> => {
    const response = await api.get<CountComparisonResponse | CountComparisonItem[]>('/inbound-outbound/count-comparison');
    return response.data;
  },

  // 상위 품목 조회
  getTopItems: async (limit: number = 10): Promise<TopItem[]> => {
    const response = await api.get<TopItem[]>('/inbound-outbound/top-items', {
      params: { limit },
    });
    return response.data;
  },
};

