import React, { useState, useEffect } from 'react';
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
import { inboundOutboundApi } from '../api/inboundOutboundApi';

const InOutStatusPage: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; 입고: number; 출고: number }[]>([]);
  const [countData, setCountData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [itemData, setItemData] = useState<{ 품목: string; 입고: number; 출고: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 모든 데이터를 병렬로 가져오기
      const [monthlyTrend, countComparison, topItems] = await Promise.all([
        inboundOutboundApi.getMonthlyTrend(),
        inboundOutboundApi.getCountComparison(),
        inboundOutboundApi.getTopItems(10),
      ]);

      console.log('API 응답 데이터:', { monthlyTrend, countComparison, topItems });

      // 백만원 단위로 변환
      const formattedMonthlyData = monthlyTrend.map((item) => ({
        month: item.month,
        입고: Math.round(item.inboundAmount / 1000000),
        출고: Math.round(item.outboundAmount / 1000000),
      }));

      // countComparison이 객체인 경우 배열로 변환
      const formattedCountData = Array.isArray(countComparison)
        ? countComparison.map((item: any, index: number) => ({
            ...item,
            color: item.color || (index === 0 ? '#3b82f6' : '#ef4444'),
          }))
        : [
            {
              name: '입고',
              value: (countComparison as any).inboundCount || 0,
              color: '#3b82f6',
            },
            {
              name: '출고',
              value: (countComparison as any).outboundCount || 0,
              color: '#ef4444',
            },
          ];

      // 백만원 단위로 변환
      const formattedItemData = topItems.map((item) => ({
        품목: item.itemName,
        입고: Math.round(item.totalInboundAmount / 1000000),
        출고: Math.round(item.totalOutboundAmount / 1000000),
      }));

      console.log('변환된 데이터:', { formattedMonthlyData, formattedCountData, formattedItemData });

      setMonthlyData(formattedMonthlyData);
      setCountData(formattedCountData);
      setItemData(formattedItemData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || '입출고 현황 데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch data:', err);
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

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
            {monthlyData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                데이터가 없습니다.
              </div>
            )}
          </div>

          {/* 입출고 건수 비교 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">입출고 건수 비교</h2>
            {countData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={countData as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {countData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                데이터가 없습니다.
              </div>
            )}
          </div>
        </div>

      {/* 품목별 입출고 현황 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">품목별 입출고 현황 (상위 10개)</h2>
        {itemData.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default InOutStatusPage;

