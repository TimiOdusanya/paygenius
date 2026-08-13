export type NotificationType =
  | 'TRANSACTION'
  | 'PROMOTION'
  | 'SECURITY'
  | 'GENIE'
  | 'SYSTEM';

export type AppNotification = {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationPreferences = {
  _id?: string;
  userId?: string;
  transactionAlerts: boolean;
  promotions: boolean;
  securityAlerts: boolean;
  genieUpdates: boolean;
  hideBalance: boolean;
  requireFaceId: boolean;
};

export type NotificationListData = {
  notifications: AppNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PreferenceUpdates = Partial<
  Pick<
    NotificationPreferences,
    | 'transactionAlerts'
    | 'promotions'
    | 'securityAlerts'
    | 'genieUpdates'
    | 'hideBalance'
    | 'requireFaceId'
  >
>;
