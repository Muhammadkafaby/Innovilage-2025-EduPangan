/**
 * MQTT Configuration for Smart Watering System
 * Broker: EMQX Cloud
 * Devices: 1-26 (Telyuk_001 - Telyuk_026)
 */

// MQTT Broker Settings
export const MQTT_CONFIG = {
  // WebSocket Secure URL for browser connections
  brokerUrl: 'wss://n11c6101.ala.asia-southeast1.emqxsl.com:8084/mqtt',
  
  // Connection options
  options: {
    keepalive: 60,
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
    protocolVersion: 4,
  }
};

// Device ID range
export const DEVICE_RANGE = {
  min: 1,
  max: 26
};

/**
 * Generate device ID string (3 digits, zero-padded)
 * @param {number} deviceNumber - Device number (1-26)
 * @returns {string} - Formatted device ID (e.g., "001", "026")
 */
export function formatDeviceId(deviceNumber) {
  return String(deviceNumber).padStart(3, '0');
}

/**
 * Generate MQTT credentials from device number
 * @param {number} deviceNumber - Device number (1-26)
 * @returns {object} - { username, password, deviceId }
 */
export function getDeviceCredentials(deviceNumber) {
  const deviceId = formatDeviceId(deviceNumber);
  return {
    deviceId,
    username: `Telyuk_${deviceId}`,
    password: `Telyuk_${deviceId}_Sukses`
  };
}

/**
 * Generate MQTT topics for a device
 * @param {string} deviceId - Device ID (e.g., "001")
 * @returns {object} - Topic names
 */
export function getDeviceTopics(deviceId) {
  const prefix = `telyuk${deviceId}`;
  return {
    data: `${prefix}/data`,       // Sensor data (subscribe)
    command: `${prefix}/command`, // Send commands (publish)
    status: `${prefix}/status`,   // Device status (subscribe)
    error: `${prefix}/error`,     // Error alerts (subscribe)
    response: `${prefix}/response` // Command responses (subscribe)
  };
}

/**
 * MQTT Command messages
 */
export const MQTT_COMMANDS = {
  PUMP_ON: { message: 'ON' },
  PUMP_OFF: { message: 'OFF' },
  PUMP_AUTO: { message: 'AUTO' },
  GET_INFO: { message: 'GET_INFO' },
  RESET_ERROR: { message: 'RESET_ERROR' }
};

/**
 * Generate list of all available devices for dropdown
 * @returns {Array} - Device options for select input
 */
export function getDeviceOptions() {
  const options = [];
  for (let i = DEVICE_RANGE.min; i <= DEVICE_RANGE.max; i++) {
    const deviceId = formatDeviceId(i);
    options.push({
      value: i,
      label: `Device ${deviceId} (Telyuk_${deviceId})`,
      deviceId
    });
  }
  return options;
}
