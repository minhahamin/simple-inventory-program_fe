import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface Column<T> {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptySearchMessage?: string;
  onDelete?: (id: string) => void;
  keyExtractor: (item: T) => string;
}

function DataTable<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = '등록된 데이터가 없습니다.',
  emptySearchMessage = '검색 결과가 없습니다.',
  onDelete,
  keyExtractor,
}: DataTableProps<T>) {
  const isEmpty = data.length === 0;
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);

  // 초기 컬럼 너비 설정 (작업 컬럼 제외)
  useEffect(() => {
    if (columns.length > 0 && Object.keys(columnWidths).length === 0) {
      const initialWidths: { [key: string]: number } = {};
      columns.forEach((col) => {
        if (col.key !== 'actions') {
          initialWidths[col.key] = 150; // 기본 너비 (작업 컬럼은 제외)
        }
      });
      setColumnWidths(initialWidths);
    }
  }, [columns, columnWidths]);

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    if (columnKey === 'actions') return; // 작업 컬럼은 리사이징 불가
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnKey);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[columnKey] || 150);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn && resizingColumn !== 'actions') {
        const diff = e.clientX - resizeStartX;
        const newWidth = Math.max(80, resizeStartWidth + diff); // 최소 너비 80px
        setColumnWidths((prev) => {
          const updated = { ...prev };
          updated[resizingColumn] = newWidth;
          return updated;
        });
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="divide-y divide-gray-200" style={{ tableLayout: 'fixed', width: '100%', minWidth: 'max-content' }}>
          <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-md">
            <tr>
              {columns.map((column, index) => {
                const isActionsColumn = column.key === 'actions';
                return (
                  <th
                    key={column.key}
                    className={`relative px-6 py-4 whitespace-nowrap text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-400/30 ${
                      index === columns.length - 1 ? 'last:border-r-0' : ''
                    } ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    } ${column.className || ''} ${
                      isActionsColumn ? 'sticky right-0 z-20 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600' : ''
                    }`}
                    style={{ 
                      width: `${isActionsColumn ? 150 : (columnWidths[column.key] || 150)}px`,
                      minWidth: isActionsColumn ? '150px' : '80px',
                      maxWidth: isActionsColumn ? '150px' : 'none',
                      ...(isActionsColumn ? { 
                        position: 'sticky',
                        right: 0,
                        zIndex: 20,
                        willChange: 'auto',
                      } : {})
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-white/30 rounded-full"></div>
                      <span className="text-white drop-shadow-sm">{column.label}</span>
                    </div>
                    {/* 리사이즈 핸들 */}
                    {!isActionsColumn && (
                      <div
                        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/40 transition-colors group"
                        onMouseDown={(e) => handleResizeStart(e, column.key)}
                      >
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-white/20 group-hover:bg-white/60 rounded-full transition-colors"></div>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 text-base font-medium">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isEvenRow = index % 2 === 0;
                return (
                  <tr
                    key={keyExtractor(item)}
                    className="group border-b border-gray-100"
                  >
                    {columns.map((column, colIndex) => {
                      const isActionsColumn = column.key === 'actions';
                      return (
                        <td
                          key={column.key}
                          className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-150 ${
                            column.align === 'right'
                              ? 'text-right'
                              : column.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          } ${column.className || ''} ${
                            isActionsColumn 
                              ? `sticky right-0 z-10 bg-white group-hover:bg-blue-50` 
                              : `${isEvenRow ? 'bg-white' : 'bg-gray-50/50'} group-hover:bg-blue-50`
                          }`}
                          style={{ 
                            width: `${isActionsColumn ? 150 : (columnWidths[column.key] || 150)}px`,
                            minWidth: isActionsColumn ? '150px' : '80px',
                            maxWidth: isActionsColumn ? '150px' : 'none',
                            ...(isActionsColumn ? { 
                              position: 'sticky',
                              right: 0,
                              zIndex: 10,
                              willChange: 'auto',
                            } : {})
                          }}
                        >
                        {column.render ? (
                          column.render(item)
                        ) : (
                          <span className="text-gray-700">{(item as any)[column.key]}</span>
                        )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

