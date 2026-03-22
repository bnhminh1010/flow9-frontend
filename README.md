# 🚀 FLOW9 - Personal Life OS

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your-username/flow9-frontend)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/your-username/flow9-frontend/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-In%20Development-yellow.svg)](https://github.com/your-username/flow9-frontend)

> Hệ thống quản lý tài chính cá nhân — **Riêng tư, Tối giản, Mạnh mẽ**. Kiểm soát hoàn toàn thu nhập, chi tiêu, ca làm việc và các khoản đăng ký trong một giao diện tối giản.

---

## ✨ Features

### 🔐 PIN Authentication
Bảo mật 6 chữ số, dữ liệu chỉ thuộc về bạn. Không cloud, không theo dõi, không quảng cáo.

### 📊 Dashboard
Tổng quan tài chính tháng với biểu đồ thu nhập/chi tiêu, tỷ lệ tiết kiệm và các khoản đăng ký sắp tới.

### 📝 Sổ ghi chép
Nhập giao dịch bằng ngôn ngữ tự nhiên: `"Ăn trưa 50k"` hoặc `"+ Lương 15tr"`. Lọc, tìm kiếm, chỉnh sửa dễ dàng.

### ⏰ Bảng công
Quản lý ca làm việc với lịch trực quan. Tính lương tự động theo loại ca và xem tổng kết tháng.

### 💳 Đăng ký & Dịch vụ
Theo dõi các khoản đăng ký định kỳ (Netflix, Spotify, v.v.) với logo thương hiệu, lịch sử thanh toán và tổng chi phí hàng tháng/năm.

### ⚙️ Cài đặt
Đổi mã PIN, xuất/nhập dữ liệu CSV để sao lưu hoặc chuyển đổi thiết bị.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Framework** | Next.js 14 (App Router) | React framework with server components |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Icons** | Lucide React | Beautiful open-source icons |
| **Charts** | Recharts | Composable charting library |

---

## 📁 Project Structure

```
flow9-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── page.tsx             # Redirects to login/dashboard
│   │   ├── login/page.tsx       # PIN login
│   │   └── dashboard/
│   │       ├── layout.tsx       # Sidebar navigation
│   │       ├── page.tsx         # Dashboard overview
│   │       ├── ledger/page.tsx  # Transactions
│   │       ├── payroll/page.tsx # Shifts
│   │       ├── subscriptions/page.tsx # Recurring bills
│   │       └── settings/page.tsx # Settings
│   ├── components/
│   │   └── CategoryIcon.tsx     # Brand logos & icons
│   ├── hooks/
│   │   └── useAuth.tsx          # Auth context
│   ├── lib/
│   │   └── api.ts               # API client
│   └── types/
│       └── index.ts             # TypeScript types
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server (flow9-backend)

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/flow9-frontend.git
cd flow9-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) — Lần đầu sử dụng, hệ thống sẽ yêu cầu tạo mã PIN 6 chữ số để bảo vệ dữ liệu.

### Environment Variables

**.env.local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Build Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy

### Vercel (Recommended)

1. Import repository vào [Vercel Dashboard](https://vercel.com)
2. Thêm biến môi trường `NEXT_PUBLIC_API_URL` trỏ đến backend
3. Deploy — hoàn tất!

### Self-hosted

```bash
npm run build
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

