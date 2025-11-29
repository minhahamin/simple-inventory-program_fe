import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { inboundOutboundApi, StatusItem } from '../api/inboundOutboundApi';

const InOutStatusPage: React.FC = () => {
  const [statusData, setStatusData] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inboundOutboundApi.getStatus();
      setStatusData(data);
    } catch (err) {
      setError('입출고 현황 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch status:', err);
    } finally {
      setLoading(false);
    }
  };

  // 월별 데이터 집계
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map<string, { 입고: number; 출고: number }>();

    statusData.forEach((item) => {
      // 입고 날짜 기준으로 월별 집계
      if (item.lastInboundDate) {
        const month = item.lastInboundDate.substring(0, 7); // YYYY-MM
        const existing = monthlyMap.get(month) || { 입고: 0, 출고: 0 };
        monthlyMap.set(month, {
          ...existing,
          입고: existing.입고 + item.totalInbound,
        });
      }

      // 출고 날짜 기준으로 월별 집계
      if (item.lastOutboundDate) {
        const month = item.lastOutboundDate.substring(0, 7); // YYYY-MM
        const existing = monthlyMap.get(month) || { 입고: 0, 출고: 0 };
        monthlyMap.set(month, {
          ...existing,
          출고: existing.출고 + item.totalOutbound,
        });
      }
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        입고: Math.round(data.입고 / 1000000), // 백만원 단위
        출고: Math.round(data.출고 / 1000000),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [statusData]);

  // 입출고 건수 데이터
  const countData = useMemo(() => {
    const totalInboundCount = statusData.reduce((sum, item) => sum + item.inboundCount, 0);
    const totalOutboundCount = statusData.reduce((sum, item) => sum + item.outboundCount, 0);

    return [
      { name: '입고', value: totalInboundCount, color: '#3b82f6' },
      { name: '출고', value: totalOutboundCount, color: '#ef4444' },
    ];
  }, [statusData]);

  // 품목별 데이터
  const itemData = useMemo(() => {
    return statusData
      .map((item) => ({
        품목: item.itemName,
        입고: Math.round(item.totalInbound / 1000000), // 백만원 단위
        출고: Math.round(item.totalOutbound / 1000000),
      }))
      .sort((a, b) => (b.입고 + b.출고) - (a.입고 + a.출고))
      .slice(0, 10); // 상위 10개만
  }, [statusData]);

  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          데이터를 불러오는 중...
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-700 text-3xl font-bold">입출고현황</h1>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 월별 입출고 추이 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">월별 입출고 추이</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: '금액 (백만원)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `${value}백만원`} />
                <Legend />
                <Line type="monotone" dataKey="입고" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="출고" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 입출고 건수 비교 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">입출고 건수 비교</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {countData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* 품목별 입출고 현황 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">품목별 입출고 현황 (상위 10개)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={itemData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: '금액 (백만원)', position: 'insideBottom' }} />
            <YAxis dataKey="품목" type="category" width={100} />
            <Tooltip formatter={(value: number) => `${value}백만원`} />
            <Legend />
            <Bar dataKey="입고" fill="#3b82f6" />
            <Bar dataKey="출고" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InOutStatusPage;

