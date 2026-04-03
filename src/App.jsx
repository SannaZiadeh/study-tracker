import React, { useState, useEffect } from "react";
import Subject from "./Components/Subject";
import SubjectList from "./Components/SubjectList";
import defaultUserPhoto from "./assets/photo_2026-04-02_22-33-35.jpg";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  
  // حالة المستخدم
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "سنا زياده";
  });
  const [userPhoto, setUserPhoto] = useState(() => {
    const savedPhoto = localStorage.getItem("userPhoto");
    return savedPhoto || defaultUserPhoto;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [tempPhoto, setTempPhoto] = useState(null);
  
  // حالة التصدير/الاستيراد
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  
  const [subjects, setSubjects] = useState(() => {
    const data = localStorage.getItem("subjects");
    return data ? JSON.parse(data) : [];
  });
  
  const addSubject = () => {
    if (!newSubjectName) return;

    const newSubject = {
      id: Date.now(),
      name: newSubjectName,
      sections: [],
    };

    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
    setShowModal(false);
  };
  
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("userPhoto", userPhoto);
  }, [userPhoto]);

  const totalProgress = () => {
    if (!subjects.length) return 0;
    let total = 0, count = 0;
    subjects.forEach((sub) => {
      sub.sections.forEach((sec) => {
        sec.lectures.forEach((lec) => {
          total += lec.studiedPages / (lec.totalPages || 1);
          count++;
        });
      });
    });
    return count ? Math.round((total / count) * 100) : 0;
  };

  // ========== دوال التصدير والاستيراد ==========
  
  // تصدير البيانات
  const exportData = () => {
    try {
      // جلب جميع البيانات من localStorage
      const allData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        subjects: subjects,
        user: {
          name: userName,
          photo: userPhoto,
        },
        settings: {
          darkMode: localStorage.getItem("darkMode") === "true",
        }
      };
      
      // تحويل البيانات إلى JSON
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      
      // إنشاء رابط التحميل
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `study_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
      
      // تنفيذ التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setBackupMessage("✅ تم تصدير البيانات بنجاح!");
      setTimeout(() => setBackupMessage(""), 3000);
    } catch (error) {
      console.error("خطأ في التصدير:", error);
      setBackupMessage("❌ فشل تصدير البيانات!");
      setTimeout(() => setBackupMessage(""), 3000);
    }
  };

  // استيراد البيانات
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // التحقق من صحة البيانات
        if (importedData.subjects && Array.isArray(importedData.subjects)) {
          setSubjects(importedData.subjects);
          
          if (importedData.user) {
            if (importedData.user.name) setUserName(importedData.user.name);
            if (importedData.user.photo) setUserPhoto(importedData.user.photo);
          }
          
          if (importedData.settings && importedData.settings.darkMode !== undefined) {
            localStorage.setItem("darkMode", importedData.settings.darkMode);
          }
          
          setBackupMessage("✅ تم استيراد البيانات بنجاح!");
          setTimeout(() => setBackupMessage(""), 3000);
          
          // إعادة تحميل الصفحة لتحديث جميع المكونات
          setTimeout(() => window.location.reload(), 1500);
        } else {
          throw new Error("ملف غير صالح");
        }
      } catch (error) {
        console.error("خطأ في الاستيراد:", error);
        setBackupMessage("❌ فشل استيراد البيانات! تأكد من صحة الملف.");
        setTimeout(() => setBackupMessage(""), 3000);
      }
    };
    reader.readAsText(file);
    
    // تنظيف input
    event.target.value = "";
  };

  // حذف جميع البيانات
  const clearAllData = () => {
    if (window.confirm("⚠️ تحذير: هذا سيحذف جميع المواد والمحاضرات والملفات الشخصية. هل أنت متأكد؟")) {
      localStorage.clear();
      setSubjects([]);
      setUserName("سنا زياده");
      setUserPhoto(defaultUserPhoto);
      setActiveSubject(null);
      setBackupMessage("🗑️ تم حذف جميع البيانات!");
      setTimeout(() => setBackupMessage(""), 3000);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // معالجة تغيير الصورة
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ تغييرات الملف الشخصي
  const saveProfileChanges = () => {
    if (editName.trim()) {
      setUserName(editName);
    }
    if (tempPhoto) {
      setUserPhoto(tempPhoto);
    }
    setShowProfileModal(false);
    setTempPhoto(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">

      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 px-6 py-3 flex justify-between items-center shadow-sm">

        <div className="flex items-center gap-3">
          <div className="bg-[#dcfce7] text-[#166534] w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm">
            S T
          </div>
          <h1 className="font-bold text-gray-800 text-lg">تطبيق متابعة الدراسة</h1>
        </div>

        <div className="hidden md:flex gap-8 items-center text-gray-500 font-medium text-sm">
          <div className="relative pb-1">
            <span className="text-gray-900 font-bold cursor-pointer">الرئيسية</span>
            <div className="absolute -bottom-[14px] left-0 right-0 h-[3px] bg-[#4ade80] rounded-full"></div>
          </div>
          <span className="hover:text-gray-800 cursor-pointer transition-colors">إحصائيات</span>
          <span className="hover:text-gray-800 cursor-pointer transition-colors">إعدادات</span>
          
          {/* زر النسخ الاحتياطي */}
          <button
            onClick={() => setShowBackupModal(true)}
            className="hover:text-gray-800 cursor-pointer transition-colors flex items-center gap-1"
          >
            💾 نسخ احتياطي
          </button>
        </div>

        {/* اليسار: المستخدم وزر الإضافة */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 ml-4 cursor-pointer group"
          >
            <div className="text-right">
              <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition">
                {userName}
              </span>
              <div className="text-xs text-gray-400 group-hover:text-green-500 transition">
                تعديل الملف الشخصي
              </div>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-green-400 transition">
              <img
                src={userPhoto}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#bbf7d0] hover:bg-[#86efac] text-[#166534] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1"
          >
            إضافة مادة <span className="text-lg">+</span>
          </button>
        </div>
      </nav>

      {/* رسالة تأكيد التصدير/الاستيراد */}
      {backupMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold">
            {backupMessage}
          </div>
        </div>
      )}

      {/* باقي المحتوى */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">

        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="flex justify-end mb-6">
            <div className="text-gray-800 font-bold text-lg">
              ملخص التقدم: <span className="text-green-500 font-black">%{totalProgress()}</span>
            </div>
          </div>

          <SubjectList
            subjects={subjects}
            setSubjects={setSubjects}
            setActiveSubject={setActiveSubject}
          />
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2">
          {activeSubject ? (
            <Subject
              subject={activeSubject}
              subjects={subjects}
              setSubjects={setSubjects}
              setActiveSubject={setActiveSubject}
            />
          ) : (
            <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-100 text-gray-400 font-bold">
              اختر مادة من القائمة لعرض التفاصيل
            </div>
          )}
        </div>
      </div>

      {/* مودال إضافة مادة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">إضافة مادة جديدة</h2>
            <input
              type="text"
              placeholder="اسم المادة..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={addSubject}
                className="px-3 py-1 rounded-lg bg-green-400 text-white hover:bg-green-500"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال النسخ الاحتياطي */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowBackupModal(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              💾 النسخ الاحتياطي
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                📥 تصدير البيانات
              </button>
              
              <label className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
                📤 استيراد بيانات
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={clearAllData}
                className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                🗑️ حذف جميع البيانات
              </button>
            </div>
            
            <div className="text-xs text-gray-400 text-center pt-2 border-t">
              * سيتم حفظ المواد والمحاضرات والملف الشخصي
            </div>
            
            <button
              onClick={() => setShowBackupModal(false)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* مودال تعديل الملف الشخصي */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 space-y-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              👤 تعديل الملف الشخصي
            </h2>

            {/* الصورة الشخصية */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-200 shadow-lg">
                  <img
                    src={tempPhoto || userPhoto}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full cursor-pointer text-xs transition shadow-md">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400">اضغط على الكاميرا لتغيير الصورة</p>
            </div>

            {/* اسم المستخدم */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">الاسم</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="أدخل اسمك"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setTempPhoto(null);
                  setEditName(userName);
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                إلغاء
              </button>
              <button
                onClick={saveProfileChanges}
                className="px-4 py-2 rounded-xl bg-green-400 hover:bg-green-500 text-white font-bold transition"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}