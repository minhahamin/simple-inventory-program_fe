import React, { useMemo } from 'react';
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

interface Inbound {
  id: string;
  inboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  memo: string;
}

interface Outbound {
  id: string;
  outboundDate: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  customer: string;
  memo: string;
}

const InOutStatusPage: React.FC = () => {
  // 입고 목업데이터
  const inbounds: Inbound[] = [
    { id: '1', inboundDate: '2024-01-15', itemCode: 'ITM-001', itemName: '노트북', quantity: 10, unitPrice: 1200000, supplier: '삼성전자', memo: '신규 입고' },
    { id: '2', inboundDate: '2024-01-16', itemCode: 'ITM-002', itemName: '마우스', quantity: 50, unitPrice: 25000, supplier: '로지텍', memo: '재고 보충' },
    { id: '3', inboundDate: '2024-01-17', itemCode: 'ITM-003', itemName: '키보드', quantity: 30, unitPrice: 85000, supplier: '코리아', memo: '정기 입고' },
    { id: '4', inboundDate: '2024-01-18', itemCode: 'ITM-004', itemName: '모니터', quantity: 20, unitPrice: 350000, supplier: 'LG전자', memo: '신규 입고' },
    { id: '5', inboundDate: '2024-01-19', itemCode: 'ITM-005', itemName: '의자', quantity: 15, unitPrice: 250000, supplier: '시디즈', memo: '재고 보충' },
    { id: '6', inboundDate: '2024-01-20', itemCode: 'ITM-006', itemName: '책상', quantity: 12, unitPrice: 180000, supplier: '이케아', memo: '신규 입고' },
    { id: '7', inboundDate: '2024-01-21', itemCode: 'ITM-007', itemName: '스피커', quantity: 25, unitPrice: 150000, supplier: '하만카돈', memo: '정기 입고' },
    { id: '8', inboundDate: '2024-01-22', itemCode: 'ITM-008', itemName: '헤드셋', quantity: 30, unitPrice: 120000, supplier: '소니', memo: '재고 보충' },
    { id: '9', inboundDate: '2024-01-23', itemCode: 'ITM-009', itemName: '웹캠', quantity: 20, unitPrice: 80000, supplier: '로지텍', memo: '신규 입고' },
    { id: '10', inboundDate: '2024-01-24', itemCode: 'ITM-010', itemName: '마이크', quantity: 15, unitPrice: 95000, supplier: '블루예티', memo: '정기 입고' },
    { id: '11', inboundDate: '2024-01-25', itemCode: 'ITM-011', itemName: '램프', quantity: 40, unitPrice: 45000, supplier: '필립스', memo: '재고 보충' },
    { id: '12', inboundDate: '2024-01-26', itemCode: 'ITM-012', itemName: '파일함', quantity: 50, unitPrice: 35000, supplier: '오피스플러스', memo: '신규 입고' },
    { id: '13', inboundDate: '2024-01-27', itemCode: 'ITM-013', itemName: '프린터', quantity: 8, unitPrice: 450000, supplier: 'HP', memo: '정기 입고' },
    { id: '14', inboundDate: '2024-01-28', itemCode: 'ITM-014', itemName: '복사기', quantity: 5, unitPrice: 1200000, supplier: '캐논', memo: '신규 입고' },
    { id: '15', inboundDate: '2024-01-29', itemCode: 'ITM-015', itemName: '스캐너', quantity: 10, unitPrice: 280000, supplier: '이pson', memo: '재고 보충' },
    { id: '16', inboundDate: '2024-01-30', itemCode: 'ITM-016', itemName: '서버', quantity: 3, unitPrice: 3500000, supplier: '델', memo: '신규 입고' },
    { id: '17', inboundDate: '2024-02-01', itemCode: 'ITM-017', itemName: '라우터', quantity: 15, unitPrice: 180000, supplier: '시스코', memo: '정기 입고' },
    { id: '18', inboundDate: '2024-02-02', itemCode: 'ITM-018', itemName: '스위치', quantity: 12, unitPrice: 250000, supplier: '넷기어', memo: '재고 보충' },
    { id: '19', inboundDate: '2024-02-03', itemCode: 'ITM-019', itemName: '백업장치', quantity: 8, unitPrice: 550000, supplier: '시게이트', memo: '신규 입고' },
    { id: '20', inboundDate: '2024-02-04', itemCode: 'ITM-020', itemName: 'USB 메모리', quantity: 100, unitPrice: 25000, supplier: '샌디스크', memo: '정기 입고' },
    { id: '21', inboundDate: '2024-02-05', itemCode: 'ITM-021', itemName: '마우스패드', quantity: 60, unitPrice: 15000, supplier: '레이저', memo: '재고 보충' },
    { id: '22', inboundDate: '2024-02-06', itemCode: 'ITM-022', itemName: '모니터암', quantity: 18, unitPrice: 120000, supplier: '에르고텍', memo: '신규 입고' },
    { id: '23', inboundDate: '2024-02-07', itemCode: 'ITM-023', itemName: '케이블', quantity: 80, unitPrice: 15000, supplier: '벨킨', memo: '정기 입고' },
    { id: '24', inboundDate: '2024-02-08', itemCode: 'ITM-024', itemName: '어댑터', quantity: 35, unitPrice: 35000, supplier: '애플', memo: '재고 보충' },
    { id: '25', inboundDate: '2024-02-09', itemCode: 'ITM-025', itemName: '충전기', quantity: 45, unitPrice: 45000, supplier: '삼성', memo: '신규 입고' },
  ];

  // 출고 목업데이터
  const outbounds: Outbound[] = [
    { id: '1', outboundDate: '2024-01-20', itemCode: 'ITM-001', itemName: '노트북', quantity: 5, unitPrice: 1200000, customer: 'ABC회사', memo: '주문 출고' },
    { id: '2', outboundDate: '2024-01-21', itemCode: 'ITM-002', itemName: '마우스', quantity: 20, unitPrice: 25000, customer: 'XYZ회사', memo: '정기 출고' },
    { id: '3', outboundDate: '2024-01-22', itemCode: 'ITM-003', itemName: '키보드', quantity: 10, unitPrice: 85000, customer: 'DEF회사', memo: '주문 출고' },
    { id: '4', outboundDate: '2024-01-23', itemCode: 'ITM-004', itemName: '모니터', quantity: 8, unitPrice: 350000, customer: 'GHI회사', memo: '정기 출고' },
    { id: '5', outboundDate: '2024-01-24', itemCode: 'ITM-005', itemName: '의자', quantity: 5, unitPrice: 250000, customer: 'JKL회사', memo: '주문 출고' },
    { id: '6', outboundDate: '2024-01-25', itemCode: 'ITM-006', itemName: '책상', quantity: 3, unitPrice: 180000, customer: 'MNO회사', memo: '정기 출고' },
    { id: '7', outboundDate: '2024-01-26', itemCode: 'ITM-007', itemName: '스피커', quantity: 8, unitPrice: 150000, customer: 'PQR회사', memo: '주문 출고' },
    { id: '8', outboundDate: '2024-01-27', itemCode: 'ITM-008', itemName: '헤드셋', quantity: 12, unitPrice: 120000, customer: 'STU회사', memo: '정기 출고' },
    { id: '9', outboundDate: '2024-01-28', itemCode: 'ITM-009', itemName: '웹캠', quantity: 6, unitPrice: 80000, customer: 'VWX회사', memo: '주문 출고' },
    { id: '10', outboundDate: '2024-01-29', itemCode: 'ITM-010', itemName: '마이크', quantity: 4, unitPrice: 95000, customer: 'YZA회사', memo: '정기 출고' },
    { id: '11', outboundDate: '2024-01-30', itemCode: 'ITM-011', itemName: '램프', quantity: 15, unitPrice: 45000, customer: 'BCD회사', memo: '주문 출고' },
    { id: '12', outboundDate: '2024-02-01', itemCode: 'ITM-012', itemName: '파일함', quantity: 20, unitPrice: 35000, customer: 'EFG회사', memo: '정기 출고' },
    { id: '13', outboundDate: '2024-02-02', itemCode: 'ITM-013', itemName: '프린터', quantity: 2, unitPrice: 450000, customer: 'HIJ회사', memo: '주문 출고' },
    { id: '14', outboundDate: '2024-02-03', itemCode: 'ITM-014', itemName: '복사기', quantity: 1, unitPrice: 1200000, customer: 'KLM회사', memo: '정기 출고' },
    { id: '15', outboundDate: '2024-02-04', itemCode: 'ITM-015', itemName: '스캐너', quantity: 3, unitPrice: 280000, customer: 'NOP회사', memo: '주문 출고' },
    { id: '16', outboundDate: '2024-02-05', itemCode: 'ITM-016', itemName: '서버', quantity: 1, unitPrice: 3500000, customer: 'QRS회사', memo: '정기 출고' },
    { id: '17', outboundDate: '2024-02-06', itemCode: 'ITM-017', itemName: '라우터', quantity: 5, unitPrice: 180000, customer: 'TUV회사', memo: '주문 출고' },
    { id: '18', outboundDate: '2024-02-07', itemCode: 'ITM-018', itemName: '스위치', quantity: 4, unitPrice: 250000, customer: 'WXY회사', memo: '정기 출고' },
    { id: '19', outboundDate: '2024-02-08', itemCode: 'ITM-019', itemName: '백업장치', quantity: 2, unitPrice: 550000, customer: 'ZAB회사', memo: '주문 출고' },
    { id: '20', outboundDate: '2024-02-09', itemCode: 'ITM-020', itemName: 'USB 메모리', quantity: 30, unitPrice: 25000, customer: 'CDE회사', memo: '정기 출고' },
    { id: '21', outboundDate: '2024-02-10', itemCode: 'ITM-021', itemName: '마우스패드', quantity: 25, unitPrice: 15000, customer: 'FGH회사', memo: '주문 출고' },
    { id: '22', outboundDate: '2024-02-11', itemCode: 'ITM-022', itemName: '모니터암', quantity: 6, unitPrice: 120000, customer: 'IJK회사', memo: '정기 출고' },
    { id: '23', outboundDate: '2024-02-12', itemCode: 'ITM-023', itemName: '케이블', quantity: 40, unitPrice: 15000, customer: 'LMN회사', memo: '주문 출고' },
    { id: '24', outboundDate: '2024-02-13', itemCode: 'ITM-024', itemName: '어댑터', quantity: 12, unitPrice: 35000, customer: 'OPQ회사', memo: '정기 출고' },
    { id: '25', outboundDate: '2024-02-14', itemCode: 'ITM-025', itemName: '충전기', quantity: 18, unitPrice: 45000, customer: 'RST회사', memo: '주문 출고' },
  ];

  // 입출고 건수 데이터
  const inboundCount = inbounds.length;
  const outboundCount = outbounds.length;

  // 월별 데이터 집계
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map<string, { inbound: number; outbound: number }>();

    inbounds.forEach((item) => {
      const month = item.inboundDate.substring(0, 7); // YYYY-MM
      const amount = item.quantity * item.unitPrice;
      const existing = monthlyMap.get(month) || { inbound: 0, outbound: 0 };
      monthlyMap.set(month, { ...existing, inbound: existing.inbound + amount });
    });

    outbounds.forEach((item) => {
      const month = item.outboundDate.substring(0, 7);
      const amount = item.quantity * item.unitPrice;
      const existing = monthlyMap.get(month) || { inbound: 0, outbound: 0 };
      monthlyMap.set(month, { ...existing, outbound: existing.outbound + amount });
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        입고: Math.round(data.inbound / 1000000), // 백만원 단위
        출고: Math.round(data.outbound / 1000000),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  // 품목별 데이터 집계
  const itemData = useMemo(() => {
    const itemMap = new Map<string, { inbound: number; outbound: number }>();

    inbounds.forEach((item) => {
      const amount = item.quantity * item.unitPrice;
      const existing = itemMap.get(item.itemName) || { inbound: 0, outbound: 0 };
      itemMap.set(item.itemName, { ...existing, inbound: existing.inbound + amount });
    });

    outbounds.forEach((item) => {
      const amount = item.quantity * item.unitPrice;
      const existing = itemMap.get(item.itemName) || { inbound: 0, outbound: 0 };
      itemMap.set(item.itemName, { ...existing, outbound: existing.outbound + amount });
    });

    return Array.from(itemMap.entries())
      .map(([itemName, data]) => ({
        품목: itemName,
        입고: Math.round(data.inbound / 1000000),
        출고: Math.round(data.outbound / 1000000),
      }))
      .sort((a, b) => (b.입고 + b.출고) - (a.입고 + a.출고))
      .slice(0, 10); // 상위 10개만
  }, []);

  // 입출고 건수 데이터
  const countData = [
    { name: '입고', value: inboundCount, color: '#3b82f6' },
    { name: '출고', value: outboundCount, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
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

