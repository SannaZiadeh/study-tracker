# 📚 تطبيق متابعة الدراسة - Study Tracker

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> تطبيق متابعة الدراسة - نظم دراستك، تابع تقدمك، وحقق أهدافك 🎯

## ✨ الميزات

### 📖 إدارة المواد والمحاضرات
- ✅ إضافة وحذف المواد الدراسية
- ✅ إضافة أقسام داخل كل مادة
- ✅ إضافة محاضرات (نظرية/عملية)
- ✅ تعديل أسماء المحاضرات

### 📊 تتبع التقدم
- ✅ نسبة الدراسة لكل محاضرة
- ✅ نسبة المراجعة لكل محاضرة
- ✅ شريط تقدم متحرك لكل المستويات
- ✅ إحصائيات عامة للمواد

### 📎 ملفات PDF
- ✅ رفع ملفات PDF للمحاضرات
- ✅ تخزين الملفات في IndexedDB (سعة كبيرة)
- ✅ عرض الملفات بنقرة واحدة
- ✅ حذف الملفات المرفوعة

### ⏱️ مؤقت الدراسة
- ✅ مؤقت لقياس وقت المذاكرة
- ✅ حفظ وقت الدراسة لكل محاضرة
- ✅ تنسيق الوقت (ساعات:دقائق:ثواني)

### 💾 نسخ احتياطي
- ✅ تصدير جميع البيانات إلى ملف JSON
- ✅ استيراد البيانات من ملف احتياطي
- ✅ حذف جميع البيانات

### 👤 الملف الشخصي
- ✅ تغيير اسم المستخدم
- ✅ تغيير الصورة الشخصية
- ✅ حفظ تلقائي في المتصفح

### 🎨 واجهة مستخدم
- ✅ تصميم عربي (RTL)
- ✅ ألوان جذابة ومريحة
- ✅ تأثيرات حركية باستخدام Framer Motion
- ✅ تصميم متجاوب (جوال، جهاز لوحي، حاسوب)

---


---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **React 18** | بناء واجهة المستخدم |
| **Vite** | أداة البناء والتشغيل السريع |
| **Tailwind CSS** | تصميم وتنسيق المكونات |
| **Framer Motion** | تأثيرات حركية |
| **IndexedDB** | تخزين ملفات PDF |
| **LocalStorage** | حفظ بيانات المواد والمحاضرات |

---

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (إصدار 18 أو أحدث)
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/username/study-tracker.git

# 2. الدخول إلى مجلد المشروع
cd study-tracker

# 3. تثبيت الاعتماديات
npm install

# 4. تشغيل المشروع محلياً
npm run dev

# 5. افتح الرابط في المتصفح
# http://localhost:5173

study-tracker/
├── src/
│   ├── Components/
│   │   ├── SubjectList.jsx      # عرض قائمة المواد
│   │   ├── Subject.jsx           # إدارة المادة والأقسام
│   │   ├── Section.jsx           # إدارة الأقسام والمحاضرات
│   │   ├── Lecture.jsx           # تفاصيل المحاضرة
│   │   └── StudyTimer.jsx        # مؤقت الدراسة
│   ├── assets/                   # الصور والملفات الثابتة
│   ├── App.jsx                   # المكون الرئيسي
│   └── main.jsx                  # نقطة الدخول
├── public/                       # الملفات العامة
├── index.html                    # ملف HTML الرئيسي
├── package.json                  # الاعتماديات
├── tailwind.config.js            # إعدادات Tailwind
├── vercel.json                   # إعدادات النشر على Vercel
└── README.md                     # توثيق المشروع