# Hệ thống Quản lý Sản xuất

Ứng dụng quản lý sản xuất cho ngành công nghiệp nhựa, được xây dựng với React, TypeScript, và PostgreSQL.

## Cài đặt và Chạy

### Yêu cầu

- Node.js (v16+)
- Docker và Docker Compose
- PostgreSQL

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/your-username/manufacturing-management-system.git
cd manufacturing-management-system
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file .env từ .env.example và cập nhật thông tin kết nối database:

```bash
cp .env.example .env
```

### Chạy ứng dụng

#### Sử dụng Docker Compose

```bash
docker-compose up -d
```

Ứng dụng sẽ chạy tại http://localhost:3000

#### Chạy riêng từng phần

1. Chạy frontend:

```bash
npm run dev
```

2. Chạy backend:

```bash
npm run server
```

## Kiểm tra kết nối database

Truy cập http://localhost:3000/api/test-db để kiểm tra kết nối đến PostgreSQL.

## Cấu trúc dự án

```
├── src/
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── server/           # Backend server code
│   │   ├── db.ts         # Database connection
│   │   └── index.ts      # Express server
│   └── ...
├── .env                  # Environment variables
├── docker-compose.yml    # Docker configuration
└── ...
```

## Công nghệ sử dụng

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Containerization: Docker
