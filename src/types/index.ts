export type UserRole = 'admin' | 'student';
export type AccountStatus = 'Pending' | 'Active' | 'Rejected';

export interface StudentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  age: number;
  avatar: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  xp: number;
  completedStages: Record<string, boolean>; // key: "levelId-stageId"
  certificates: CertificateItem[];
}

export interface CertificateItem {
  id: string;
  levelNumber: number;
  levelTitle: string;
  studentName: string;
  issueDate: string;
  certificateCode: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  hint: string;
}

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  stages: Stage[];
}
