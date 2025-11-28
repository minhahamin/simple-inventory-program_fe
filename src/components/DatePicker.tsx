import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  className = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const days = [];
  // 빈 칸 추가
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div ref={datePickerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white hover:border-blue-400 transition-colors flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? formatDisplayDate(selectedDate) : placeholder}
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
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-80 p-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-semibold text-gray-800">
              {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square" />;
              }
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`aspect-square rounded-md text-sm transition-all duration-150 ${
                    isSelected(day)
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : isToday(day)
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* 오늘 버튼 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleToday}
              className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              오늘
            </button>
          </div>
        </div>
      )}

      {/* 숨겨진 input (폼 제출용) */}
      <input type="hidden" value={value} required={required} />
    </div>
  );
};

export default DatePicker;

