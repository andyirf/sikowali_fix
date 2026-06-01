# Implementation Plan  

## Overview  
The system is a **student‑centered information platform** that stores and manages:  

| Area | Data |
|------|------|
| **User Management** | Authentication & role (admin/teacher) |
| **Student Registry** | Personal & class information |
| **Academic Scores (Nilai)** | KKM, assignments, exams, calculated averages |
| **Attendance (Absensi)** | Presence, sick, permission, unexcused |
| **Behaviour Notes (Catatan prilaku)** | Teacher notes, follow‑up, responses |
| **Student Works (karya)** | Documentation of projects/artifacts with images |
| **Work Comments (karya_comment)** | Comments on each work |
| **Announcements** | School‑wide messages, importance flag, categories |

All data lives in relational tables that are linked in a **linear logical flow** (User → Students → Nilai → Absensi → Catatan prilaku → karya → karya_comment). The implementation will expose a **RESTful API** (or GraphQL) for a web/mobile front‑end, enforce role‑based access, and keep the data consistent via foreign‑key relationships.

---

## Components  

| Component | Purpose | Suggested Tech / Frameworks | Key Configuration |
|-----------|---------|-----------------------------|--------------------|
| **user** (table `users`) | Stores login credentials and role information. | • PostgreSQL / MySQL <br>• ORM (SQLAlchemy‑Python, Prisma‑Node, or Django ORM) <br>• Password hashing library (bcrypt, Argon2) | • `id` PK, auto‑increment <br>• Unique index on `usernama` <br>• `role` ENUM (`admin`, `teacher`, `staff`) |
| **Students** (table `Students`) | Master list of students. | Same DB + ORM as above. | • `id` PK <br>• `nama_students` NOT NULL <br>• `kelas` VARCHAR(10) <br>• `orangtua` JSON or separate contact table |
| **Nilai** (table `kkm`) | Academic scores per student. | Same DB + ORM. | • `id` PK <br>• FK `nama_students` → `Students.id` <br>• Numeric columns (`kkm`, `tugas`, `uh1`, `uh2`, `uts`, `uas`) <br>• Trigger / computed column for `rata_rata` |
| **Absensi** (table `Absensi`) | Daily attendance records. | Same DB + ORM. | • `id` PK <br>• FK `nama_students` → `Students.id` <br>• Integer counters (`haidr`, `sakit`, `ijin`, `alpha`) |
| **Catatan_prilaku** (table `Catatan_prilaku`) | Behavioural notes & teacher responses. | Same DB + ORM. | • `id` PK <br>• FK `nama_students` → `Students.id` <br>• Text fields (`catatan`, `keterangan`, `tanggapan`) |
| **karya** (table `Dokumentasi_karya`) | Student project documentation. | Same DB + ORM. | • `karya_id` PK <br>• FK `nama_students` → `Students.id` <br>• `image_url` stored in object storage (S3/MinIO) |
| **karya_comment** (table `karya_comments`) | Comments on each work. | Same DB + ORM. | • Composite PK (`karya_id`, `author`, `date`) <br>• FK `karya_id` → `karya.karya_id` |
| **announcements** (table `announcements`) | School announcements. | Same DB + ORM. | • `id` PK <br>• `is_important` BOOLEAN <br>• Index on `category` and `date` for fast retrieval |

**Non‑functional components** (not shown in the diagram but required for a production system):  

* **API Server** – Node.js + Express, or Python + FastAPI/Django REST Framework.  
* **Authentication Service** – JWT with refresh tokens, integrated with `users`.  
* **Front‑end** – React (or Vue/Angular) SPA, optionally a mobile app via React Native.  
* **Object Storage** – Amazon S3, Google Cloud Storage, or self‑hosted MinIO for `image_url`.  
* **CI/CD Pipeline** – GitHub Actions / GitLab CI for lint, test, build, and deploy.  
* **Infrastructure** – Docker Compose for local dev, Kubernetes (or managed service) for production.

---

## Data Flow  

1. **User Authentication** – A client sends credentials → **user** table validates → JWT issued.  
2. **Student Management** – Authenticated admin/teacher creates/updates a record in **Students**.  
3. **Score Entry** – Teacher posts scores → row inserted in **Nilai** (FK to `Students.id`). The DB trigger calculates `rata_rata`.  
4. **Attendance Logging** – Daily attendance API updates **Absensi** (FK to `Students.id`).  
5. **Behaviour Notes** – Teacher adds a note → row in **Catatan_prilaku** (FK to `Students.id`). Optional response stored in `tanggapan`.  
6. **Project Documentation** – Student (or teacher) uploads a project → entry in **karya** (FK to `Students.id`, image stored in object storage, URL saved).  
7. **Comments on Projects** – Any authenticated user posts a comment → row in **karya_comment** (FK to `karya.karya_id`).  
8. **Announcements** – Admin creates an announcement → row in **announcements** (available to all users).  

The **linear arrows** in the diagram simply illustrate logical dependencies (e.g., a student must exist before scores can be recorded). In practice, each table is independently addressable via the API, but foreign‑key constraints enforce the order.

---

## Implementation Steps  

### Phase 1 – Foundations  
1. **Create repository** (Git) with standard folder layout (`/backend`, `/frontend`, `/infra`).  
2. **Set up Docker Compose**:  
   - PostgreSQL service (named `db`).  
   - MinIO (optional) for image storage.  
   - Backend service (Node/Express or FastAPI).  
   - Front‑end service (React).  
3. **Initialize backend project**:  
   - Choose language/framework.  
   - Install ORM, JWT library, validation lib (e.g., Joi, Pydantic).  
4. **Define DB schema** (SQL migration files or ORM models) for all eight tables, including PK/FK constraints and indexes.  
5. **Run migrations** against local DB and verify tables are created.

### Phase 2 – Core Services  
6. **Implement authentication**:  
   - `/api/auth/login` (verify password with bcrypt/argon2).  
   - Issue access & refresh JWTs.  
   - Middleware to protect routes and inject `req.user`.  
7. **Build CRUD endpoints** for **Students** (admin/teacher role).  
8. **Create Nilai endpoints** (`POST /nilai`, `GET /nilai/:studentId`). Include server‑side calculation of `rata_rata`.  
9. **Add Absensi endpoints** (`POST /absensi`, `GET /absensi/:studentId`).  
10. **Add Catatan_prilaku endpoints** (`POST /catatan`, `GET /catatan/:studentId`).  
11. **Implement karya endpoints**:  
    - File upload handling (multipart/form‑data).  
    - Store image in MinIO/S3, save URL.  
    - `GET /karya/:studentId` list.  
12. **Implement karya_comment endpoints** (`POST /karya/:id/comments`, `GET /karya/:id/comments`).  

### Phase 3 – Ancillary Features  
13. **Announcements module**: CRUD endpoints, filter by `is_important` and `category`.  
14. **Role‑Based Access Control (RBAC)**:  
    - `admin` → full access.  
    - `teacher` → read/write for all tables except user management.  
    - `staff` (if needed) → read‑only for most tables.  
15. **Input validation & sanitisation** for all request bodies.  
16. **Error handling middleware** returning consistent JSON error format.  

### Phase 4 – Front‑end (optional but recommended)  
17. Scaffold React app with TypeScript.  
18. Implement authentication flow (login page, token storage, auto‑refresh).  
19. Build UI pages:  
    - Student list & detail.  
    - Score entry table.  
    - Attendance dashboard.  
    - Behaviour notes view/editor.  
    - Project gallery with comment thread.  
    - Announcements feed.  
20. Integrate with backend using Axios/Fetch, handling 401/403 redirects.

### Phase 5 – Testing & Quality  
21. Write unit tests for backend services (Jest, PyTest).  
22. Write integration tests for API endpoints (SuperTest, HTTPX).  
23. Front‑end component tests (React Testing Library).  
24. Set up CI pipeline to run lint + tests on each PR.  

### Phase 6 – Deployment & Ops  
25. Create Helm chart / Kubernetes manifests (or Docker Swarm) for:  
    - DB (with persistent volume).  
    - Backend (replicas, health probes).  
    - Front‑end (static assets served via Nginx).  
    - Object storage (MinIO) if self‑hosted.  
26. Configure **Ingress** with TLS (Let's Encrypt).  
27. Set up **environment variables** for DB connection string, JWT secret, S3 credentials.  
28. Enable **logging** (structured JSON) and **monitoring** (Prometheus + Grafana).  
29. Perform load testing on critical endpoints (score entry, attendance).  
30. Conduct security review (OWASP Top 10) and fix findings.  

### Phase 7 – Documentation & Handover  
31. Generate OpenAPI/Swagger spec from route definitions.  
32. Write README with setup, dev, and deployment instructions.  
33. Provide runbooks for DB backup/restore and secret rotation.  

---

## Dependencies  

| Category | Item | Reason |
|----------|------|--------|
| **Database** | PostgreSQL 13+ (or MySQL 8) | Relational storage with foreign‑key support. |
| **ORM** | SQLAlchemy (Python) **or** Prisma (Node) | Model definitions & migrations. |
| **Web Framework** | FastAPI (Python) **or** Express + TypeScript (Node) | REST API, async support. |
| **Auth** | PyJWT / jsonwebtoken + bcrypt/argon2 | Secure password hashing & JWT handling. |
| **Validation** | Pydantic (FastAPI) **or** Joi (Express) | Input sanitisation. |
| **Object Storage** | Amazon S3 / MinIO | Store `image_url` files. |
| **Front‑end** | React 18 + TypeScript + Vite | Modern SPA. |
| **Testing** | PyTest / Jest, SuperTest, React Testing Library | Automated test suite. |
| **CI/CD** | GitHub Actions (or GitLab CI) | Automated lint, test, build, deploy. |
| **Containerisation** | Docker, Docker‑Compose, Kubernetes | Consistent environments. |
| **Monitoring** | Prometheus, Grafana, Loki (logs) | Observability. |
| **Security** | Helmet (Express) / FastAPI security utilities, CORS, HTTPS termination | Baseline hardening. |

---

## Security Considerations  

1. **Password Storage** – Use Argon2id or bcrypt with cost factor ≥ 12. Never store plain text.  
2. **Transport Encryption** – Enforce HTTPS everywhere (TLS termination at Ingress).  
3. **JWT Security** – Sign with strong secret (≥ 256‑bit) or RSA keys, short access‑token lifespan (15 min), rotate refresh tokens.  
4. **RBAC** – Verify role on every endpoint; deny privilege escalation.  
5. **SQL Injection Prevention** – Use prepared statements/ORM parameter binding exclusively.  
6. **Input Validation** – Whitelist fields, length limits, regex for usernames/emails.  
7. **File Uploads** – Validate MIME type, size limit (e.g., ≤ 5 MB), store outside web root, generate random filenames.  
8. **CORS** – Restrict origins to known front‑end domain(s).  
9. **Rate Limiting** – Apply per‑IP/IP‑user limits on auth endpoints (e.g., 5 attempts / minute).  
10. **Audit Logging** – Log create/update/delete actions with user ID, timestamp, and affected record ID.  
11. **Backup & Recovery** – Daily encrypted backups of the DB, test restores quarterly.  
12. **Secrets Management** – Keep DB credentials, JWT secret, S3 keys in environment variables or secret manager (Vault, AWS Secrets Manager).  

---

## Notes  

* The diagram’s **linear arrows** are logical, not mandatory sequential processing; each table can be accessed independently once foreign‑key constraints are satisfied.  
* `nama_students` appears as a foreign key in many tables; in the implementation we will store the **student’s `id`** as the FK and keep `nama_students` as a denormalised read‑only field (or compute via joins) to avoid duplication.  
* `announcements` is **stand‑alone** – no incoming arrows; it can be managed directly by admins.  
* Consider adding **soft‑delete** (`deleted_at` timestamp) to tables where historical data must be retained (e.g., Nilai, Absensi).  
* For scalability, the **karya** images can be served via a CDN (CloudFront, Cloudflare) after upload.  

---  

*Prepared by: Senior Software Engineer*  
*Date: 2026‑05‑21*  