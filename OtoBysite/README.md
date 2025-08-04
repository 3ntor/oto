# OtoBysite - نظام حجز وإدارة الرحلات

نظام شامل لحجز وإدارة الرحلات مع دعم ثلاثة أنواع من المستخدمين: الركاب، السائقين، والمدراء.

## المميزات

### 👥 أنواع المستخدمين
- **الركاب (راكب)**: حجز الرحلات، عرض QR Code، إدارة الحجوزات
- **السائقين (سائق)**: إدارة الرحلات المخصصة، مسح QR Code للركاب
- **المدراء (مدير)**: إدارة كاملة للنظام، إحصائيات، إدارة المستخدمين

### 🚌 المميزات الرئيسية
- حجز الرحلات مع اختيار المقاعد
- توليد QR Code فريد لكل حجز
- مسح QR Code من قبل السائقين
- لوحة إدارة شاملة للمدراء
- واجهة مستخدم حديثة ومتجاوبة
- نظام مصادقة آمن مع JWT
- إدارة الأدوار والصلاحيات

## التقنيات المستخدمة

### Frontend
- **React.js** - مكتبة واجهة المستخدم
- **TailwindCSS** - إطار عمل CSS
- **React Router** - إدارة التنقل
- **Axios** - طلبات HTTP
- **React Hot Toast** - إشعارات
- **Lucide React** - الأيقونات
- **React QR Code** - توليد QR Code

### Backend
- **Node.js** - بيئة التشغيل
- **Express.js** - إطار عمل الخادم
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة
- **bcryptjs** - تشفير كلمات المرور
- **QRCode** - توليد QR Code
- **CORS** - إدارة الطلبات المتقاطعة

## التثبيت والتشغيل

### المتطلبات
- Node.js (v14 أو أحدث)
- MongoDB
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd OtoBysite
```

2. **تثبيت اعتماديات الخادم**
```bash
cd server
npm install
```

3. **تثبيت اعتماديات العميل**
```bash
cd ../client
npm install
```

4. **إعداد متغيرات البيئة**

إنشاء ملف `.env` في مجلد `server`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/otobysite
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

إنشاء ملف `.env` في مجلد `client`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **تشغيل الخادم**
```bash
cd server
npm run dev
```

6. **تشغيل العميل**
```bash
cd client
npm start
```

## هيكل المشروع

```
OtoBysite/
├── client/                    # Frontend - React
│   ├── public/
│   ├── src/
│   │   ├── components/       # المكونات القابلة لإعادة الاستخدام
│   │   ├── pages/           # صفحات التطبيق
│   │   ├── context/         # إدارة الحالة
│   │   ├── services/        # خدمات API
│   │   ├── routes/          # إدارة التنقل
│   │   └── layouts/         # تخطيطات الصفحات
│   └── package.json
├── server/                   # Backend - Node.js
│   ├── config/              # إعدادات قاعدة البيانات
│   ├── controllers/         # منطق الأعمال
│   ├── middleware/          # الوسائط البرمجية
│   ├── models/              # نماذج قاعدة البيانات
│   ├── routes/              # مسارات API
│   ├── utils/               # أدوات مساعدة
│   └── server.js            # نقطة البداية
└── README.md
```

## API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/profile` - الحصول على الملف الشخصي

### الرحلات
- `GET /api/trips` - الحصول على جميع الرحلات
- `GET /api/trips/:id` - الحصول على رحلة محددة
- `POST /api/trips` - إنشاء رحلة جديدة (مدير)
- `PUT /api/trips/:id` - تحديث رحلة (مدير)
- `DELETE /api/trips/:id` - حذف رحلة (مدير)

### الحجوزات
- `POST /api/bookings` - إنشاء حجز جديد
- `GET /api/bookings/my-bookings` - حجوزات المستخدم
- `GET /api/bookings/:id` - الحصول على حجز محدد
- `PUT /api/bookings/:id/status` - تحديث حالة الحجز
- `DELETE /api/bookings/:id` - إلغاء الحجز

### المستخدمين
- `GET /api/users` - الحصول على جميع المستخدمين (مدير)
- `GET /api/users/:id` - الحصول على مستخدم محدد (مدير)
- `PUT /api/users/:id` - تحديث مستخدم (مدير)
- `DELETE /api/users/:id` - حذف مستخدم (مدير)

## المميزات المتقدمة

### نظام QR Code
- توليد QR Code فريد لكل حجز
- مسح QR Code من قبل السائقين
- تأكيد صعود الركاب

### لوحة الإدارة
- إحصائيات شاملة
- إدارة الرحلات والمستخدمين
- مراقبة الحجوزات

### الأمان
- تشفير كلمات المرور
- JWT للمصادقة
- إدارة الأدوار والصلاحيات
- حماية المسارات

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

للدعم والاستفسارات، يرجى التواصل عبر:
- البريد الإلكتروني: info@otobysite.com
- الهاتف: +966 50 123 4567

## التحديثات القادمة

- [ ] تطبيق جوال للسائقين
- [ ] نظام إشعارات في الوقت الفعلي
- [ ] دفع إلكتروني
- [ ] تتبع الرحلات في الوقت الفعلي
- [ ] تقارير متقدمة
- [ ] دعم متعدد اللغات