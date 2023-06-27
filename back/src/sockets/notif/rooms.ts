let userNotifs = {};

export function getUserDeviceRoom(userId: string, deviceId: string) {
  return `user:${userId}-device:${deviceId}`;
} // this will return the roomName
