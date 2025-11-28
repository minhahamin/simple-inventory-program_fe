import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  enableRange?: boolean;
  onRangeChange?: (startDate: string, endDate: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  className = '',
  required = false,
  enableRange = false,
  onRangeChange,
}) => {
  const createDate = (year: number, month: number, day: number = 1): Date => {
    return new Date(year, month, day, 0, 0, 0, 0);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return createDate(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (value) {
      const date = new Date(value);
      return createDate(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return null;
  });
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const normalizedDate = createDate(date.getFullYear(), date.getMonth(), date.getDate());
      setSelectedDate(normalizedDate);
      setCurrentMonth(createDate(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearPicker(false);
        setShowMonthPicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = createDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isRangeMode) {
      // 범위 선택 모드
      if (!rangeStartDate || (rangeStartDate && rangeEndDate)) {
        // 시작 날짜 선택 또는 리셋
        setRangeStartDate(newDate);
        setRangeEndDate(null);
      } else if (rangeStartDate && !rangeEndDate) {
        // 종료 날짜 선택
        if (newDate < rangeStartDate) {
          // 종료 날짜가 시작 날짜보다 이전이면 교체
          setRangeEndDate(rangeStartDate);
          setRangeStartDate(newDate);
        } else {
          setRangeEndDate(newDate);
        }
        // 범위 선택 완료 시 콜백 호출
        if (onRangeChange) {
          const start = formatDate(newDate < rangeStartDate ? newDate : rangeStartDate);
          const end = formatDate(newDate < rangeStartDate ? rangeStartDate : newDate);
          onRangeChange(start, end);
        }
        // 범위 선택 완료 후 모달 닫기
        setIsOpen(false);
      }
    } else {
      // 단일 날짜 선택 모드
      setSelectedDate(newDate);
      onChange(formatDate(newDate));
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1;
    const newYear = currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear();
    setCurrentMonth(createDate(newYear, newMonth, 1));
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1;
    const newYear = currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear();
    setCurrentMonth(createDate(newYear, newMonth, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(createDate(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(createDate(currentMonth.getFullYear(), month, 1));
    setShowMonthPicker(false);
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleToday = () => {
    const today = new Date();
    const normalizedToday = createDate(today.getFullYear(), today.getMonth(), today.getDate());
    setSelectedDate(normalizedToday);
    setCurrentMonth(createDate(today.getFullYear(), today.getMonth(), 1));
    onChange(formatDate(normalizedToday));
    setIsOpen(false);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (isRangeMode && enableRange) {
      // 범위 선택 모드에서는 시작/종료 날짜만 선택된 것으로 표시
      if (rangeStartDate && 
          rangeStartDate.getDate() === date.getDate() &&
          rangeStartDate.getMonth() === date.getMonth() &&
          rangeStartDate.getFullYear() === date.getFullYear()) {
        return true;
      }
      if (rangeEndDate &&
          rangeEndDate.getDate() === date.getDate() &&
          rangeEndDate.getMonth() === date.getMonth() &&
          rangeEndDate.getFullYear() === date.getFullYear()) {
        return true;
      }
      return false;
    } else {
      if (!selectedDate) return false;
      return (
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
      );
    }
  };

  const isInRange = (date: Date) => {
    if (!isRangeMode || !rangeStartDate || !rangeEndDate) return false;
    return date >= rangeStartDate && date <= rangeEndDate;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 항상 6주(42일)를 표시하도록 날짜 배열 생성
  const days: Array<{ day: number; isCurrentMonth: boolean; date: Date } | null> = [];
  
  // 이전 달의 마지막 날짜들
  const prevMonth = currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1;
  const prevYear = currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear();
  const daysInPrevMonth = getDaysInMonth(createDate(prevYear, prevMonth, 1));
  
  // 이전 달의 마지막 날짜들 추가
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push({
      day,
      isCurrentMonth: false,
      date: createDate(prevYear, prevMonth, day),
    });
  }
  
  // 현재 달의 날짜들 추가
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: createDate(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    });
  }
  
  // 다음 달의 날짜들 추가 (총 42개가 될 때까지)
  const nextMonth = currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1;
  const nextYear = currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear();
  let nextDay = 1;
  while (days.length < 42) {
    days.push({
      day: nextDay,
      isCurrentMonth: false,
      date: createDate(nextYear, nextMonth, nextDay),
    });
    nextDay++;
  }

  return (
    <div ref={datePickerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white hover:border-blue-400 transition-colors flex items-center justify-between"
      >
        <span className={`${value || (isRangeMode && rangeStartDate && rangeEndDate) ? 'text-gray-900' : 'text-gray-400'} whitespace-nowrap overflow-hidden text-ellipsis`}>
          {isRangeMode && rangeStartDate && rangeEndDate
            ? `${formatDisplayDate(rangeStartDate)} ~ ${formatDisplayDate(rangeEndDate)}`
            : value
            ? formatDisplayDate(selectedDate)
            : placeholder}
        </span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-96 p-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4 relative">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowYearPicker(!showYearPicker);
                  setShowMonthPicker(false);
                }}
                className="px-3 py-1 font-semibold text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                {currentMonth.getFullYear()}년
              </button>
              <button
                onClick={() => {
                  setShowMonthPicker(!showMonthPicker);
                  setShowYearPicker(false);
                }}
                className="px-3 py-1 font-semibold text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                {monthNames[currentMonth.getMonth()]}
              </button>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 년도 선택 드롭다운 */}
            {showYearPicker && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto w-32">
                <div className="p-2">
                  {getYearRange().map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                        year === currentMonth.getFullYear()
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 월 선택 드롭다운 */}
            {showMonthPicker && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32">
                <div className="p-2 grid grid-cols-3 gap-1">
                  {monthNames.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthSelect(index)}
                      className={`px-2 py-2 text-xs rounded-md transition-colors ${
                        index === currentMonth.getMonth()
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {month.replace('월', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => {
              const isSunday = index === 0;
              const isSaturday = index === 6;
              return (
                <div
                  key={day}
                  className={`text-center text-xs font-semibold py-2 ${
                    isSunday ? 'text-red-600' : isSaturday ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1" style={{ height: '252px' }}>
            {days.map((dayInfo, index) => {
              if (!dayInfo) {
                return <div key={index} className="aspect-square" style={{ height: '36px' }} />;
              }
              const { day, isCurrentMonth, date } = dayInfo;
              const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;
              
              // 요일별 텍스트 색상 결정
              let textColorClass = '';
              if (isSelected(date)) {
                textColorClass = 'text-white'; // 선택된 날짜는 흰색
              } else if (isToday(date)) {
                if (isSunday) {
                  textColorClass = 'text-red-700';
                } else if (isSaturday) {
                  textColorClass = 'text-blue-700';
                } else {
                  textColorClass = 'text-blue-700';
                }
              } else if (isCurrentMonth) {
                if (isSunday) {
                  textColorClass = 'text-red-600';
                } else if (isSaturday) {
                  textColorClass = 'text-blue-600';
                } else {
                  textColorClass = 'text-gray-700';
                }
              } else {
                if (isSunday) {
                  textColorClass = 'text-red-400';
                } else if (isSaturday) {
                  textColorClass = 'text-blue-400';
                } else {
                  textColorClass = 'text-gray-400';
                }
              }
              
              const inRange = isInRange(date);
              const isStartDate = rangeStartDate && 
                rangeStartDate.getDate() === date.getDate() &&
                rangeStartDate.getMonth() === date.getMonth() &&
                rangeStartDate.getFullYear() === date.getFullYear();
              const isEndDate = rangeEndDate &&
                rangeEndDate.getDate() === date.getDate() &&
                rangeEndDate.getMonth() === date.getMonth() &&
                rangeEndDate.getFullYear() === date.getFullYear();
              
              return (
                <button
                  key={`${date.getFullYear()}-${date.getMonth()}-${day}-${index}`}
                  onClick={() => {
                    if (isCurrentMonth || isRangeMode) {
                      handleDateSelect(day);
                    } else {
                      // 다른 달의 날짜를 클릭하면 해당 달로 이동
                      setCurrentMonth(createDate(date.getFullYear(), date.getMonth(), 1));
                    }
                  }}
                  className={`aspect-square rounded-md text-sm transition-all duration-150 flex items-center justify-center font-medium ${
                    isSelected(date)
                      ? 'bg-blue-600 shadow-md text-white'
                      : inRange && isCurrentMonth
                      ? 'bg-blue-200 text-gray-700'
                      : isToday(date) && !isRangeMode
                      ? `bg-blue-100 ${textColorClass}`
                      : isCurrentMonth
                      ? `hover:bg-blue-50 ${textColorClass}`
                      : `hover:bg-gray-50 ${textColorClass}`
                  } ${isStartDate || isEndDate ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                  style={{ height: '36px' }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* 오늘 버튼 및 범위 선택 */}
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleToday}
              className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              오늘
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsRangeMode(!isRangeMode);
                  if (isRangeMode) {
                    setRangeStartDate(null);
                    setRangeEndDate(null);
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  isRangeMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isRangeMode ? '단일 선택' : '범위 선택'}
              </button>
            </div>
            
            {isRangeMode && (
              <div className="text-xs text-gray-600 space-y-1">
                {rangeStartDate && (
                  <div className="flex justify-between">
                    <span>시작일:</span>
                    <span className="font-medium">{formatDisplayDate(rangeStartDate)}</span>
                  </div>
                )}
                {rangeEndDate && (
                  <div className="flex justify-between">
                    <span>종료일:</span>
                    <span className="font-medium">{formatDisplayDate(rangeEndDate)}</span>
                  </div>
                )}
                {rangeStartDate && !rangeEndDate && (
                  <div className="text-blue-600 font-medium">종료일을 선택하세요</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 숨겨진 input (폼 제출용) */}
      <input type="hidden" value={value} required={required} />
    </div>
  );
};

export default DatePicker;

