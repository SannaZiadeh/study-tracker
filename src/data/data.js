export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    sections: [
      {
        name: "Theory",
        lectures: [
          { id: 1, title: "Calculus Lecture 1", totalPages: 20, studiedPages: 10, reviewedPages: 5 },
          { id: 2, title: "Calculus Lecture 2", totalPages: 25, studiedPages: 0, reviewedPages: 0 }
        ]
      },
      {
        name: "Practical",
        lectures: [
          { id: 1, title: "Calculus Lab 1", totalPages: 10, studiedPages: 5, reviewedPages: 2 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Physics",
    sections: [
      {
        name: "Theory",
        lectures: [
          { id: 1, title: "Mechanics Lecture 1", totalPages: 15, studiedPages: 5, reviewedPages: 1 }
        ]
      },
      {
        name: "Practical",
        lectures: [
          { id: 1, title: "Mechanics Lab 1", totalPages: 8, studiedPages: 2, reviewedPages: 0 }
        ]
      }
    ]
  }
];