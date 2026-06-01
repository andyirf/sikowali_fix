export type Role = "orangtua" | "Guru" | "kepalasekolah" | "Admin" | "Administrator" | "Murid";

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  enabled?: boolean;
}

export interface ParentRegistration {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone: string;
  studentNis: string;
  studentName: string;
  className: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  nis: string;
  parentName?: string;
  parentId?: string;
  userId?: string;
  enabled?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  className: string;
  position: string;
  teacherNumber: string;
  phone: string;
  graduate: string;
  address: string;
  email: string;
  userId?: string;
  enabled?: boolean;
}

export interface AISettings {
  provider: string;
  model: string;
  enabled: boolean;
  systemPrompt: string;
  apiKeyEnv?: string;
  baseUrl?: string;
  updatedAt?: string;
}

export interface SchoolSettings {
  id: string;
  name: string;
  npsn?: string;
  level?: string;
  status?: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  academicYear?: string;
  semester?: string;
  logoUrl?: string;
  updatedAt?: string;
}

export interface CrudPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface AccessMatrixRow {
  featureId: string;
  feature: string;
  category: string;
  permissions: Record<Role, CrudPermission>;
}

export interface ClassRoom {
  id: string;
  name: string;
  homeroomTeacherId?: string;
}

export interface SubjectScore {
  subject: string;
  kkm: number;
  tugas: number;
  uh1: number;
  uh2: number;
  uts: number;
  uas: number;
  rataRata: number;
}

export type DisciplineType = "Positif" | "Prestasi" | "Perlu Perhatian";

export interface BehaviourLog {
  id: string;
  type: DisciplineType;
  title: string;
  description: string;
  teacher: string;
  date: string;
  sourcePortal?: string;
}

export interface AttendanceRecord {
  month: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  persentase: number;
}

export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpha";

export interface AttendanceDailyRecord {
  id?: number;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentKarya {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  comments: {
    author: string;
    text: string;
    date: string;
  }[];
  category: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: "warning" | "info" | "urgent";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isImportant: boolean;
  category: string;
  imageUrl?: string;
}

export interface ParentingArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  imageUrl: string;
}

export interface ParentFeedback {
  id: string;
  author: string;
  type: "Positif" | "Keluhan" | "Saran";
  content: string;
  date: string;
  likes: number;
  comments: {
    author: string;
    text: string;
    date: string;
  }[];
}

export interface ChatbotBackup {
  id: string;
  studentId?: string;
  studentName?: string;
  userId?: string;
  userName: string;
  userRole: Role;
  portal: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface AIChatQuota {
  userId: string;
  periodMonth: string;
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface SIKOWALIDatabase {
  currentUser?: User;
  student: Student;
  students?: Student[];
  visibleStudents?: Student[];
  classes?: ClassRoom[];
  teachers?: Teacher[];
  selectedClassName?: string;
  scores: SubjectScore[];
  attendance: AttendanceRecord[];
  attendanceDaily?: AttendanceDailyRecord[];
  behaviour: BehaviourLog[];
  karya: StudentKarya[];
  notifications?: PortalNotification[];
  announcements: Announcement[];
  parenting: ParentingArticle[];
  feedback: ParentFeedback[];
  chatbotBackups?: ChatbotBackup[];
  parentRegistrations?: ParentRegistration[];
  users?: User[];
  aiSettings?: AISettings;
  schoolSettings?: SchoolSettings;
  accessMatrix?: AccessMatrixRow[];
  isUsingMariaDB?: boolean;
  dbDiagnostics?: {
    isUsingMariaDB: boolean;
    host: string;
    port: number;
    user: string;
    database: string;
    error: string | null;
  };
}
