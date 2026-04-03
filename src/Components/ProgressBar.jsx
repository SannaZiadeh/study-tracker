import { motion } from "framer-motion";

const colors = ["#e0ffcd", "#fdffcd", "#ffebbb", "#ffcab0"];

export default function SubjectList({ subjects, setSubjects, setActiveSubject }) {
  const addSubject = () => {
    const name = prompt("اسم المادة");
    if (!name) return;

    setSubjects([...subjects, { id: Date.now(), name, sections: [] }]);
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
      }, 0) /
        sub.sections.length) *
        100
    );
  };

  return (
    <div className="p-4">
      <button
        onClick={addSubject}
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
              <div className="flex justify-between">
                <h3 className="font-bold">{sub.name}</h3>
                <span>{progress}%</span>
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
    </div>
  );
}