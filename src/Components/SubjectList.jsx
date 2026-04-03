import { motion } from "framer-motion";
import { useState } from "react";

const colors = ["#e0ffcd", "#fdffcd", "#ffebbb", "#ffcab0"];

export default function SubjectList({ subjects, setSubjects, setActiveSubject }) {
  const [showModal, setShowModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [theoryCount, setTheoryCount] = useState(0);
  const [practicalCount, setPracticalCount] = useState(0);
  const removeSubject = (subjectId) => {
    const filtered = subjects.filter((s) => s.id !== subjectId);
    setSubjects(filtered);
    setActiveSubject(null); // لو كانت المادة المفتوحة هي اللي انحذفت
  };
  const getProgress = (sub) => {
    if (!sub.sections.length) return 0;

    return Math.round(
      (sub.sections.reduce((acc, sec) => {
        if (!sec.lectures.length) return acc;
        return (
          acc +
          sec.lectures.reduce(
            (a, l) => a + l.studiedPages / (l.totalPages || 1),
            0
          ) /
          sec.lectures.length
        );
      }, 0) / sub.sections.length) * 100
    );
  };

  const addSubject = () => {
    if (!newSubjectName) return;

    const totalLectures = [];

    for (let i = 1; i <= theoryCount; i++) {
      totalLectures.push({
        id: Date.now() + i,
        name: `محاضرة نظرية ${i}`,
        totalPages: 0,
        studiedPages: 0,
        reviewedPages: 0,
      });
    }

    for (let i = 1; i <= practicalCount; i++) {
      totalLectures.push({
        id: Date.now() + theoryCount + i,
        name: `محاضرة عملية ${i}`,
        totalPages: 0,
        studiedPages: 0,
        reviewedPages: 0,
      });
    }

    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: newSubjectName,
        sections: [
          {
            id: Date.now() + 1,
            name: "القسم الرئيسي",
            lectures: totalLectures,
          },
        ],
      },
    ]);

    setNewSubjectName("");
    setTheoryCount(0);
    setPracticalCount(0);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-green-300 px-4 py-2 rounded-lg hover:bg-green-400 transition"
      >
        + إضافة مادة
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((sub, i) => {
          const progress = getProgress(sub);
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubject(sub)}
              className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              style={{ background: colors[i % colors.length] }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{sub.name}</h3>
                <div className="flex items-center gap-2">
                  <span>{progress}%</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // منع فتح المادة عند الضغط على زر الحذف
                      removeSubject(sub.id);
                    }}
                    className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100 transition"
                  >
                    ✖
                  </button>
                </div>
              </div>

              <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa)",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
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
            <label className="text-sm font-medium text-gray-700 mb-1">
              عدد المحاضرات النظرية (اختياري)
            </label>
            <input
              type="number"

              value={theoryCount}
              onChange={(e) => setTheoryCount(Number(e.target.value) || 0)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
            />
            <label className="text-sm font-medium text-gray-700 mb-1">
              عدد المحاضرات العملية (اختياري)
            </label>
            <input
              type="number"

              value={practicalCount}
              onChange={(e) => setPracticalCount(Number(e.target.value) || 0)}
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
    </div>
  );
}