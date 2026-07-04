export type AppTheme = "light" | "dark" | "system";
export type TimeFormat = "12h" | "24h";
export type FirstDayOfWeek = "monday" | "sunday";

export interface Settings {
  id: string;
  currency: string;
  theme: AppTheme;
  language: string;
  dateFormat: string;
  timeFormat: TimeFormat;
  firstDayOfWeek: FirstDayOfWeek;
  createdAt: Date;
  updatedAt: Date;
}
