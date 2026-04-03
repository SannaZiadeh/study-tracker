import React, { useState, useEffect } from "react";
import StudyTimer from "./StudyTimer";
const Lecture = ({ lecture, updateLecture, removeLecture }) => {
  const [local, setLocal] = useState(lecture);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState(local.name);

  const handleChange = (field, value) => {
    const updated = { ...local, [field]: Number(value) };
    setLocal(updated);
    updateLecture(updated);
  };

  // فتح قاعدة البيانات
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("LecturesDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("pdfs")) {
          db.createObjectStore("pdfs");
        }
      };
    });
  };

  // حفظ الملف في IndexedDB
  const savePdfToDB = async (lectureId, file) => {
    const db = await openDB();
    const transaction = db.transaction(["pdfs"], "readwrite");
    const store = transaction.objectStore("pdfs");

    return new Promise((resolve, reject) => {
      const request = store.put(file, lectureId.toString());
      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  };

  // جلب الملف من IndexedDB
  const getPdfFromDB = async (lectureId) => {
    const db = await openDB();
    const transaction = db.transaction(["pdfs"], "readonly");
    const store = transaction.objectStore("pdfs");

    return new Promise((resolve, reject) => {
      const request = store.get(lectureId.toString());
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();
    });
  };

  // حذف الملف من IndexedDB
  const deletePdfFromDB = async (lectureId) => {
    const db = await openDB();
    const transaction = db.transaction(["pdfs"], "readwrite");
    const store = transaction.objectStore("pdfs");

    return new Promise((resolve, reject) => {
      const request = store.delete(lectureId.toString());
      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  };

  // عرض الملف
  const openPdf = async () => {
    if (local.pdfId) {
      const fileBlob = await getPdfFromDB(local.pdfId);
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      }
    }
  };

  // حذف الملف المرفوع
  const removePdf = async () => {
    if (local.pdfId) {
      await deletePdfFromDB(local.pdfId);
      const updated = {
        ...local,
        pdf: null,
        pdfId: null,
      };
      setLocal(updated);
      updateLecture(updated);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const lectureId = local.id;
      await savePdfToDB(lectureId, file);

      const updated = {
        ...local,
        pdf: file.name,
        pdfId: lectureId,
      };
      setLocal(updated);
      updateLecture(updated);
    } else {
      alert("يرجى رفع ملف PDF فقط");
    }
  };

  const studyProgress = local.totalPages > 0 ? Math.round((local.studiedPages / local.totalPages) * 100) : 0;
  const reviewProgress = local.totalPages > 0 ? Math.round((local.reviewedPages / local.totalPages) * 100) : 0;

  const saveEdit = () => {
    const updated = { ...local, name: editedName };
    setLocal(updated);
    updateLecture(updated);
    setShowEditModal(false);
  };

  // تحميل الملف عند تحميل الكومبوننت
  useEffect(() => {
    const loadPdf = async () => {
      if (local.pdfId && !local.pdfBlob) {
        const blob = await getPdfFromDB(local.pdfId);
        if (blob) {
          setLocal(prev => ({ ...prev, pdfBlob: blob }));
        }
      }
    };
    loadPdf();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm space-y-3 hover:shadow-lg transition-all duration-300">

      {/* رأس المحاضرة - الاسم والنسبة */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="font-bold text-gray-800">{local.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-600">{studyProgress}%</span>
        </div>
      </div>

      {/* شريط نسبة الدراسة */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-gray-600">📚 نسبة الدراسة</span>
          <span className="text-blue-600">{studyProgress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${studyProgress}%`,
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            }}
          />
        </div>
      </div>

      {/* شريط نسبة المراجعة */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-gray-600">🔄 نسبة المراجعة</span>
          <span className="text-green-600">{reviewProgress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${reviewProgress}%`,
              background: "linear-gradient(90deg, #16a34a, #4ade80)",
            }}
          />
        </div>
      </div>

      {/* حقول إدخال الصفحات */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 mb-1">📄 إجمالي</label>
          <input
            type="number"
            min="0"
            value={local.totalPages || 0}
            onChange={(e) => handleChange("totalPages", e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 mb-1">✅ مدروسة</label>
          <input
            type="number"
            min="0"
            value={local.studiedPages || 0}
            onChange={(e) => handleChange("studiedPages", e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 mb-1">🔄 مراجعة</label>
          <input
            type="number"
            min="0"
            value={local.reviewedPages || 0}
            onChange={(e) => handleChange("reviewedPages", e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2 items-center flex-wrap mt-2">
        {/* زر رفع PDF */}
        <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow">
          📎 رفع PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {/* عرض الملف المرفوع - زر مع X مدمج بنفس اللون */}
        {local.pdf && (
          <div className="flex items-center gap-0">
            <button
              onClick={openPdf}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 py-1.5 rounded-r-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow"
            >
              <span>📄</span>
              <span>{local.pdf.length > 20 ? local.pdf.slice(0, 15) + '...' : local.pdf}</span>
            </button>
            <button
              onClick={removePdf}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:bg-red-500 hover:from-red-500 hover:to-red-600 text-white px-2 py-1.5 rounded-l-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow group"
              title="حذف الملف"
            >
              <span className="group-hover:rotate-90 transition-transform duration-200">✖</span>
            </button>
          </div>
        )}
        {/* مؤقت الدراسة */}
        <StudyTimer
          lecture={local}
          onTimeUpdate={(newTime) => {
            const updated = { ...local, studyTime: newTime };
            setLocal(updated);
            updateLecture(updated);
          }}
        />

        {/* زر تعديل */}
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
        >
          ✏️ تعديل
        </button>

        {/* زر حذف المحاضرة */}
        <button
          onClick={() => {
            if (window.confirm(`هل أنت متأكد من حذف "${local.name}"؟`)) {
              removeLecture(local.id);
            }
          }}
          className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1"
        >
          <span>🗑️</span>
          <span>حذف</span>
        </button>
      </div>

      {/* مودال تعديل الاسم */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              ✏️ تعديل اسم المحاضرة
            </h2>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition"
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                إلغاء
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-bold transition"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lecture;