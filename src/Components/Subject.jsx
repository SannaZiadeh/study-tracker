import React, { useState } from "react";
import Section from "./Section";

export default function Subject({ subject, subjects, setSubjects, setActiveSubject }) {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const updateSubject = (updated) => {
    const newSubs = subjects.map((s) => (s.id === updated.id ? updated : s));
    setSubjects(newSubs);
    setActiveSubject(updated);
  };

  const addSection = () => {
    if (!newSectionName) return;

    updateSubject({
      ...subject,
      sections: [
        ...subject.sections,
        { id: Date.now(), name: newSectionName, lectures: [] },
      ],
    });

    setNewSectionName("");
    setShowSectionModal(false);
  }
  const calcProgress = () => {
    let studyTotal = 0;
    let reviewTotal = 0;
    let count = 0;

    subject.sections.forEach((sec) => {
      sec.lectures.forEach((lec) => {
        studyTotal += lec.studiedPages / (lec.totalPages || 1);
        reviewTotal += lec.reviewedPages / (lec.totalPages || 1);
        count++;
      });
    });

    return {
      study: count ? Math.round((studyTotal / count) * 100) : 0,
      review: count ? Math.round((reviewTotal / count) * 100) : 0,
    };
  };

  const { study, review } = calcProgress();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#f0fdf4] p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-gray-800">
            {subject.name}
          </h2>

          <button
            onClick={() => setShowSectionModal(true)}
            className="bg-white px-3 py-1 rounded-lg shadow hover:bg-gray-50"
          >
            + إضافة قسم
          </button>
        </div>

        {/* 📊 Progress Bars */}

        <div className="mt-4 space-y-3">

          {/* دراسة */}
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>📘 الدراسة</span>
              <span>{study}%</span>
            </div>

            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${study}%`,
                  background: "linear-gradient(90deg,#bfdbfe,#93c5fd,#60a5fa)",
                }}
              ></div>
            </div>
          </div>

          {/* مراجعة */}
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>📗 المراجعة</span>
              <span>{review}%</span>
            </div>

            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${review}%`,
                  background: "linear-gradient(90deg,#bbf7d0,#86efac,#4ade80)",
                }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      <div className="space-y-4">
        {subject.sections.map((sec) => (
          <Section
            key={sec.id}
            section={sec}
            subject={subject}
            updateSubject={updateSubject}
          />
        ))}
      </div>

      {/* Modal إضافة قسم */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              إضافة قسم جديد
            </h2>
            <input
              type="text"
              placeholder="اسم القسم..."
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSectionModal(false)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={addSection}
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