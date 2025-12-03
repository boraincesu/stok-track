export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface NotificationSettings {
  orderAlerts: boolean;
  lowStockWarnings: boolean;
  weeklyReports: boolean;
}

export interface UserSettings {
  profile: UserProfile;
  notifications: NotificationSettings;
}
