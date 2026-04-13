import React, { useState, useEffect } from "react";

const StudyTimer = ({ lecture, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(() => {
    return lecture.studyTime || 0;
  });
  const [showTimerModal, setShowTimerModal] = useState(false);

  // تنسيق الوقت
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // حفظ الوقت
  const saveTime = (newSeconds) => {
    setSeconds(newSeconds);
    if (onTimeUpdate) {
      onTimeUpdate(newSeconds);
    }
    localStorage.setItem(`studyTime_${lecture.id}`, newSeconds);
  };

  // بدء المؤقت
  const startTimer = () => {
    setIsRunning(true);
  };

  // إيقاف المؤقت
  const stopTimer = () => {
    setIsRunning(false);
  };

  // إعادة تعيين
  const resetTimer = () => {
    if (window.confirm("هل أنت متأكد من إعادة تعيين المؤقت؟")) {
      setIsRunning(false);
      saveTime(0);
    }
  };

  // مؤقت يضيف ثانية كل ثانية
  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          if (onTimeUpdate) onTimeUpdate(newSeconds);
          localStorage.setItem(`studyTime_${lecture.id}`, newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, lecture.id]);

  // تحميل الوقت المحفوظ عند فتح الصفحة
  useEffect(() => {
    const savedTime = localStorage.getItem(`studyTime_${lecture.id}`);
    if (savedTime && !seconds) {
      setSeconds(parseInt(savedTime));
    }
  }, [lecture.id]);

  return (
    <>
      <button
        onClick={() => setShowTimerModal(true)}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1"
      >
        <span>⏱️</span>
        <span>{formatTime(seconds)}</span>
        {isRunning && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
      </button>

      {showTimerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTimerModal(false)}>
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <div className="text-6xl font-bold font-mono text-purple-600">
                {formatTime(seconds)}
              </div>
              <div className="text-sm text-gray-400 mt-2">{lecture.name}</div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="bg-green-500 hover:bg-green-600 text-white w-20 py-3 rounded-2xl font-bold"
                >
                  بدء
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="bg-red-500 hover:bg-red-600 text-white w-20 py-3 rounded-2xl font-bold"
                >
                  إيقاف
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-20 py-3 rounded-2xl font-bold"
              >
                إعادة
              </button>
            </div>

            <div className="text-xs text-gray-400">
              وقت الدراسة: {Math.floor(seconds / 60)} دقيقة و {seconds % 60} ثانية
            </div>

            <button
              onClick={() => setShowTimerModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudyTimer;
