import React, { ReactNode, useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Pagination from './Pagination';

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
  itemsPerPage?: number;
  showPagination?: boolean;
  fileName?: string; // 엑셀 다운로드 파일명
}

function DataTable<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = '등록된 데이터가 없습니다.',
  emptySearchMessage = '검색 결과가 없습니다.',
  onDelete,
  keyExtractor,
  itemsPerPage: initialItemsPerPage = 10,
  showPagination = true,
  fileName = '데이터',
}: DataTableProps<T>) {
  const isEmpty = data.length === 0;
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const tableRef = useRef<HTMLTableElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  // 페이지네이션 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = showPagination && data.length > itemsPerPage 
    ? data.slice(startIndex, endIndex) 
    : data;

  // 데이터가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // itemsPerPage가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 테이블 상단으로 스크롤
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 체크박스 관련 함수
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(item => keyExtractor(item)));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedItems.has(keyExtractor(item)));
  const isIndeterminate = paginatedData.some(item => selectedItems.has(keyExtractor(item))) && !isAllSelected;
  const hasSelectedItems = selectedItems.size > 0;

  // 선택된 항목들 삭제
  const handleDeleteSelected = () => {
    if (!onDelete || selectedItems.size === 0) return;
    
    const confirmMessage = `선택된 ${selectedItems.size}개의 항목을 삭제하시겠습니까?`;
    if (window.confirm(confirmMessage)) {
      selectedItems.forEach((id) => {
        onDelete(id);
      });
      setSelectedItems(new Set());
    }
  };

  // 엑셀 다운로드 함수
  const handleExportExcel = () => {
    if (data.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    // 헤더 생성 (체크박스, 행번호, 작업 컬럼 제외)
    const headers = columns
      .filter(col => col.key !== 'checkbox' && col.key !== 'rowNumber' && col.key !== 'actions')
      .map(col => col.label);

    // 데이터 행 생성
    const rows = data.map(item => {
      return columns
        .filter(col => col.key !== 'checkbox' && col.key !== 'rowNumber' && col.key !== 'actions')
        .map(col => {
          // 숫자 타입 필드는 render 함수가 있어도 원본 숫자 값 사용
          const originalValue = (item as any)[col.key];
          if (typeof originalValue === 'number') {
            return originalValue;
          }
          
          if (col.render) {
            // render 함수가 있으면 텍스트만 추출 (HTML 제거)
            const rendered = col.render(item);
            if (typeof rendered === 'string') {
              return rendered;
            } else if (React.isValidElement(rendered)) {
              // React 요소인 경우 텍스트 추출
              const props = rendered.props as { children?: ReactNode };
              return props?.children || '';
            }
            return '';
          }
          return originalValue || '';
        });
    });

    // 워크북 생성
    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // 컬럼 너비 설정
    const columnWidths = columns
      .filter(col => col.key !== 'checkbox' && col.key !== 'rowNumber' && col.key !== 'actions')
      .map(col => ({ wch: Math.max(col.label.length, 15) }));
    worksheet['!cols'] = columnWidths;

    // 워크북 생성 및 다운로드
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 파일명 생성 (현재 날짜 포함)
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const downloadFileName = `${fileName}_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, downloadFileName);
  };

  // 초기 컬럼 너비 설정 (체크박스, 행번호, 작업 컬럼 제외)
  useEffect(() => {
    if (columns.length > 0 && Object.keys(columnWidths).length === 0) {
      const initialWidths: { [key: string]: number } = {};
      columns.forEach((col) => {
        if (col.key !== 'actions' && col.key !== 'checkbox' && col.key !== 'rowNumber') {
          initialWidths[col.key] = 150; // 기본 너비
        }
      });
      setColumnWidths(initialWidths);
    }
  }, [columns, columnWidths]);

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    if (columnKey === 'actions' || columnKey === 'checkbox' || columnKey === 'rowNumber') return; // 작업, 체크박스, 행번호 컬럼은 리사이징 불가
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
    <div className="flex flex-col gap-3">
      {/* 엑셀 다운로드 버튼 및 삭제 버튼 */}
      <div className="flex justify-end gap-3">
        {hasSelectedItems && onDelete && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>선택 삭제 ({selectedItems.size})</span>
          </button>
        )}
        <button
          onClick={handleExportExcel}
          disabled={data.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            data.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>엑셀 다운로드</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col" style={{ height: '600px' }}>
        <div className="overflow-x-auto flex-1 overflow-y-auto relative">
        <table ref={tableRef} className="divide-y divide-gray-200" style={{ tableLayout: 'fixed', width: '100%', minWidth: 'max-content' }}>
          <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-md sticky top-0 z-30">
            <tr>
              {/* 체크박스 컬럼 */}
              <th
                className="relative px-4 py-4 whitespace-nowrap text-center text-xs font-bold text-white uppercase tracking-wider border-r border-blue-400/30 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"
                style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
              </th>
              {/* 행번호 컬럼 */}
              <th
                className="relative px-4 py-4 whitespace-nowrap text-center text-xs font-bold text-white uppercase tracking-wider border-r border-blue-400/30 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"
                style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-4 bg-white/30 rounded-full"></div>
                  <span className="text-white drop-shadow-sm">번호</span>
                </div>
              </th>
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
                      isActionsColumn ? 'sticky right-0 z-40 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600' : ''
                    }`}
                    style={{ 
                      width: `${isActionsColumn ? 150 : (columnWidths[column.key] || 150)}px`,
                      minWidth: isActionsColumn ? '150px' : '80px',
                      maxWidth: isActionsColumn ? '150px' : 'none',
                      ...(isActionsColumn ? { 
                        position: 'sticky',
                        right: 0,
                        zIndex: 40,
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
          <tbody ref={tbodyRef} className="bg-white divide-y divide-gray-100">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-16">
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
              paginatedData.map((item, index) => {
                const isEvenRow = index % 2 === 0;
                const itemId = keyExtractor(item);
                const rowNumber = startIndex + index + 1;
                const isSelected = selectedItems.has(itemId);
                return (
                  <tr
                    key={itemId}
                    className={`group border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''} cursor-pointer`}
                    onClick={() => handleSelectItem(itemId, !isSelected)}
                  >
                    {/* 체크박스 컬럼 */}
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-center transition-colors duration-150 ${
                        isEvenRow ? 'bg-white' : 'bg-gray-50/50'
                      } ${isSelected ? 'bg-blue-50' : ''} group-hover:bg-blue-50`}
                      style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectItem(itemId, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                    </td>
                    {/* 행번호 컬럼 */}
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700 transition-colors duration-150 ${
                        isEvenRow ? 'bg-white' : 'bg-gray-50/50'
                      } ${isSelected ? 'bg-blue-50' : ''} group-hover:bg-blue-50`}
                      style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}
                    >
                      {rowNumber}
                    </td>
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
                          } ${isSelected ? 'bg-blue-50' : ''}`}
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
      {showPagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">페이지당 항목 수:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={100}>100개</option>
            </select>
          </div>
          {data.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={data.length}
            />
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default DataTable;

