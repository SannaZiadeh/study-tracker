import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StudyTimer = ({ lecture, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(() => {
    return lecture.studyTime || 0;
  });
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(() => {
    // استرجاع وقت آخر إشعار من localStorage
    const saved = localStorage.getItem(`lastNotification_${lecture.id}`);
    return saved ? parseInt(saved) : 0;
  });
  
  const intervalRef = useRef(null);
  const notificationIntervalRef = useRef(null);

  // طلب إذن الإشعارات عند تحميل المكون
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // إرسال إشعار تحفيزي
  const sendMotivationalNotification = (minutes) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const messages = {
      30: "🎉 مبروك! أكملت نصف ساعة دراسة! استمر، أنت رائع! 💪",
      60: "🔥 رائع! أكملت ساعة كاملة من التركيز! أنت مميز! 🌟",
      90: "🏆 إنجاز كبير! ساعة ونصف من الدراسة المتواصلة! فخور بك! 📚",
      120: "👑 أسطورة! ساعتين دراسة! أنت قدوة! 🎯"
    };

    const message = messages[minutes] || `✅ ممتاز! أكملت ${minutes} دقيقة دراسة! استمر على هذا المنوال! 🚀`;
    
    new Notification("📚 تطبيق متابعة الدراسة", {
      body: message,
      icon: "/icons.svg",
      badge: "/icons.svg",
      vibrate: [200, 100, 200],
      silent: false,
    });
  };

  // التحقق من الإشعارات كل دقيقة
  const checkForNotifications = (currentSeconds) => {
    const currentMinutes = Math.floor(currentSeconds / 60);
    
    // إشعار كل 30 دقيقة
    if (currentMinutes > 0 && currentMinutes % 30 === 0 && currentMinutes !== lastNotificationTime) {
      sendMotivationalNotification(currentMinutes);
      setLastNotificationTime(currentMinutes);
      localStorage.setItem(`lastNotification_${lecture.id}`, currentMinutes);
    }
  };

  // تنسيق الوقت (hh:mm:ss)
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
    if (onTimeUpdate) {
      onTimeUpdate(newSeconds);
    }
    // حفظ في localStorage كنسخة احتياطية
    localStorage.setItem(`studyTime_${lecture.id}`, newSeconds);
  };

  // بدء المؤقت
  const startTimer = () => {
    setIsRunning(true);
    
    // استرجاع الوقت المحفوظ عند البدء
    const savedTime = localStorage.getItem(`studyTime_${lecture.id}`);
    if (savedTime && !seconds) {
      setSeconds(parseInt(savedTime));
    }
    
    // مؤقت كل ثانية
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const newSeconds = prev + 1;
        saveTime(newSeconds);
        checkForNotifications(newSeconds);
        return newSeconds;
      });
    }, 1000);
  };

  // إيقاف المؤقت
  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // إعادة تعيين المؤقت
  const resetTimer = () => {
    if (window.confirm("هل أنت متأكد من إعادة تعيين المؤقت؟ سيتم حذف وقت الدراسة المسجل.")) {
      stopTimer();
      setSeconds(0);
      saveTime(0);
      setLastNotificationTime(0);
      localStorage.removeItem(`lastNotification_${lecture.id}`);
      localStorage.removeItem(`studyTime_${lecture.id}`);
    }
  };

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // تحديث وقت المؤقت في حالة تغيير المحاضرة
  useEffect(() => {
    const savedTime = localStorage.getItem(`studyTime_${lecture.id}`);
    if (savedTime && lecture.studyTime !== parseInt(savedTime)) {
      setSeconds(parseInt(savedTime));
      if (onTimeUpdate) onTimeUpdate(parseInt(savedTime));
    }
  }, [lecture.id]);

  return (
    <>
      {/* زر فتح المؤقت */}
      <button
        onClick={() => setShowTimerModal(true)}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1"
      >
        <span>⏱️</span>
        <span>{formatTime(seconds)}</span>
        {isRunning && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
      </button>

      {/* مودال المؤقت */}
      <AnimatePresence>
        {showTimerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowTimerModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="text-6xl font-bold font-mono bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatTime(seconds)}
                </div>
                <div className="text-sm text-gray-400 mt-2">{lecture.name}</div>
                {isRunning && (
                  <div className="text-xs text-green-500 mt-1 animate-pulse">
                    ⏳ جاري الدراسة...
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white w-20 py-3 rounded-2xl font-bold transition-all"
                  >
                    ▶ بدء
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-20 py-3 rounded-2xl font-bold transition-all"
                  >
                    ⏸ إيقاف
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-20 py-3 rounded-2xl font-bold transition-all"
                >
                  🔄 إعادة
                </button>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <div>⏱️ وقت الدراسة: {Math.floor(seconds / 60)} دقيقة و {seconds % 60} ثانية</div>
                <div>🎯 الهدف القادم: {30 - (Math.floor(seconds / 60) % 30)} دقيقة للإشعار التالي</div>
                <hr className="my-2" />
                <div className="text-purple-500">✨ إشعارات تحفيزية كل 30 دقيقة ✨</div>
              </div>

              <button
                onClick={() => {
                  setShowTimerModal(false);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudyTimer;
