import React, { useState } from "react";
import Lecture from "./Lecture.jsx";

const Section = ({ section, subject, updateSubject }) => {
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [newLectureName, setNewLectureName] = useState("");
    const removeLecture = (lectureId) => {
        const newSecs = subject.sections.map((s) =>
            s.id === section.id
                ? { ...s, lectures: s.lectures.filter((l) => l.id !== lectureId) }
                : s
        );
        updateSubject({ ...subject, sections: newSecs });
    };
    const progress =
        section.lectures.length > 0
            ? Math.round(
                (section.lectures.reduce(
                    (acc, lec) => acc + lec.studiedPages / (lec.totalPages || 1),
                    0
                ) / section.lectures.length) * 100
            )
            : 0;

    const updateLecture = (updated) => {
        const newSecs = subject.sections.map((s) =>
            s.id === section.id
                ? { ...s, lectures: s.lectures.map((l) => (l.id === updated.id ? updated : l)) }
                : s
        );
        updateSubject({ ...subject, sections: newSecs });
    };

    const addLecture = () => {
        if (!newLectureName) return;

        const newLec = {
            id: Date.now(),
            name: newLectureName,
            totalPages: 0,
            studiedPages: 0,
            reviewedPages: 0,
        };

        const newSecs = subject.sections.map((s) =>
            s.id === section.id ? { ...s, lectures: [...s.lectures, newLec] } : s
        );

        updateSubject({ ...subject, sections: newSecs });
        setNewLectureName("");
        setShowLectureModal(false);
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{section.name}</h3>
                <span className="text-sm">{progress}%</span>
            </div>

            <div className="w-full h-1 bg-gray-200 rounded">
                <div
                    className="h-1 rounded transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg,#facc15,#f97316)",
                    }}
                ></div>
            </div>

            {/* زر فتح مودال إضافة محاضرة */}
            <button
                onClick={() => setShowLectureModal(true)}
                className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
            >
                ➕ إضافة محاضرة
            </button>

            {/* قائمة المحاضرات */}
            <div className="space-y-2">
                {section.lectures.map((lec) => (
                    <Lecture
                        key={lec.id}
                        lecture={lec}
                        updateLecture={updateLecture}
                        removeLecture={removeLecture}
                    />
                ))}
            </div>

            {/* مودال إضافة محاضرة */}
            {showLectureModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            إضافة محاضرة جديدة
                        </h2>
                        <input
                            type="text"
                            placeholder="اسم المحاضرة..."
                            value={newLectureName}
                            onChange={(e) => setNewLectureName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                            onKeyDown={(e) => e.key === "Enter" && addLecture()}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowLectureModal(false)}
                                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={addLecture}
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
};

export default Section;