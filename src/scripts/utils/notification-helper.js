// File: src/scripts/utils/notification-helper.js
import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../template';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration?.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) return;

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Sudah berlangganan push notification.');
    return;
  }

  const failureMessage = 'Langganan push notification gagal diaktifkan.';
  const successMessage = 'Langganan push notification berhasil diaktifkan.';

  let pushSubscription = null;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureMessage);
      await pushSubscription.unsubscribe();
      return;
    }

    alert(successMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureMessage);

    if (pushSubscription) await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const subscription = await getPushSubscription();
  if (!subscription) {
    alert('Kamu belum berlangganan notifikasi.');
    return;
  }

  const failureMessage = 'Gagal berhenti langganan push notification.';
  const successMessage = 'Berhasil berhenti langganan push notification.';

  try {
    const endpoint = subscription.endpoint;
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      console.error('unsubscribe: response:', response);
      alert(failureMessage);
      return;
    }

    await subscription.unsubscribe();
    alert(successMessage);
  } catch (error) {
    console.error('unsubscribe: error:', error);
    alert(failureMessage);
  }
}

export async function setupPushButtonUI(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isSubscribed = await isCurrentPushSubscriptionAvailable();
  container.innerHTML = isSubscribed
    ? generateUnsubscribeButtonTemplate()
    : generateSubscribeButtonTemplate();

  const button = document.getElementById(isSubscribed ? 'unsubscribe-button' : 'subscribe-button');
  if (isSubscribed) {
    button.addEventListener('click', async () => {
      await unsubscribe();
      setupPushButtonUI(containerId);
    });
  } else {
    button.addEventListener('click', async () => {
      await subscribe();
      setupPushButtonUI(containerId);
    });
  }
}
