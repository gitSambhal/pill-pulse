/**
 * PillPulse - Notification Service
 * Developer: Suhail Akhtar (https://suhail.top)
 */

class NotificationService {
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }

  public showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return null;
    }

    try {
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {
          // ignore
        }
      }

      const notification = new Notification(title, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        silent: false,
        requireInteraction: true,
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (err) {
      console.warn('Could not display system notification:', err);
      return null;
    }
  }
}

export const notificationService = new NotificationService();
