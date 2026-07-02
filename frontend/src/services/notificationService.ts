import api from './api';

export interface Notification {
   id?: string;
   _id?: string;
   type: string;
   title: string;
   description: string;
   is_read: boolean;
   created_at: string;
}

export const notificationService = {
   async getNotifications(): Promise<Notification[]> {
      const response = await api.get('/notifications/');
      return response.data;
   },

   async markAllAsRead(): Promise<void> {
      await api.post('/notifications/mark-all-read');
   },

   async triggerLoginEvent(): Promise<void> {
      try {
         await api.post('/notifications/login-event');
      } catch (e) {
         console.warn("Failed to trigger login event notification:", e);
      }
   },

   async triggerDownloadEvent(bookName: string): Promise<void> {
      try {
         await api.post(`/notifications/download-event?book_name=${encodeURIComponent(bookName)}`);
      } catch (e) {
         console.warn("Failed to trigger download event notification:", e);
      }
   }
};
