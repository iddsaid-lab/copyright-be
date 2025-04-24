// Notification service stub
// Replace with integration to email, SMS, or in-app notification as needed
export async function sendNotification({ userId, type, message }) {
  // Log for now; integrate with real service later
  console.log(`[NOTIFICATION] To user ${userId} (${type}): ${message}`);
}
