'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt from 'mqtt';
import { MQTT_CONFIG, getDeviceCredentials, DEVICE_RANGE, formatDeviceId } from '../lib/mqttConfig';

/**
 * Admin MQTT Hook - Monitors ALL active devices dynamically
 * 
 * From firmware: topic = "telyuk" + DEVICE_ID + "/data"
 * DEVICE_ID is always 3 digits: "001", "008", "011", "024", etc.
 * Uses wildcard subscription to capture ALL devices, not just 001-026
 */
export function useAdminMqtt() {
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState({});
  const [connectionError, setConnectionError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const clientRef = useRef(null);
  const isMountedRef = useRef(true);

  // Initialize with empty devices - will be populated dynamically
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Helper function to create a new device entry
  const createDeviceEntry = (deviceId) => ({
    deviceId: deviceId,
    deviceNumber: parseInt(deviceId, 10),
    online: false,
    moisture: null,
    adcRaw: null,
    pumpStatus: 'MATI',
    pumpMode: 'AUTO',
    status: 'NORMAL',
    lastSeen: null
  });

  const connect = useCallback(() => {
    if (clientRef.current) return;

    // Use admin test account credentials that has access to all topics
    const username = 'test';
    const password = 'test';
    
    console.log('[Admin] Connecting as', username);
    
    const client = mqtt.connect(MQTT_CONFIG.brokerUrl, {
      ...MQTT_CONFIG.options,
      username: username,
      password: password,
      clientId: `admin_${Date.now()}`
    });

    clientRef.current = client;

    client.on('connect', () => {
      if (!isMountedRef.current) { client.end(); return; }
      
      console.log('[Admin] Connected!');
      setIsConnected(true);
      setConnectionError(null);

      // Subscribe using wildcard '#' to capture ALL topics (same as EMQX test)
      // This will match telyuk001/data, telyuk016/data, telyuk022/data, etc.
      const wildcardTopic = '#';
      
      client.subscribe(wildcardTopic, { qos: 0 }, (err, granted) => {
        if (err) {
          console.error('[Admin] Subscribe error:', err);
        } else {
          console.log('[Admin] Subscribed to wildcard topic:', wildcardTopic);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (!isMountedRef.current) return;
      
      const msg = message.toString();
      console.log('[Admin]', topic, '=', msg.slice(0, 80));
      
      // Parse: telyuk008/data -> deviceId=008, subtopic=data
      const match = topic.match(/^telyuk(\d{3})\/(\w+)$/);
      if (!match) return;
      
      const [, deviceId, subtopic] = match;

      setDevices(prev => {
        const upd = { ...prev };
        // Dynamically create device entry if it doesn't exist
        if (!upd[deviceId]) {
          upd[deviceId] = createDeviceEntry(deviceId);
          console.log('[Admin] Discovered new device:', deviceId);
        }
        const dev = { ...upd[deviceId] };

        if (subtopic === 'data') {
          // Only set online when receiving actual sensor data
          dev.online = true;
          dev.lastSeen = new Date().toISOString();
          try {
            const data = JSON.parse(msg);
            dev.moisture = data.kelembapan ?? dev.moisture;
            dev.adcRaw = data.adc_raw ?? dev.adcRaw;
            dev.pumpStatus = data.pompa ?? dev.pumpStatus;
            dev.pumpMode = data.mode ?? dev.pumpMode;
            dev.status = data.status ?? dev.status;
          } catch {}
        } else if (subtopic === 'status') {
          // Handle status messages (but don't auto-set online for retained messages)
          if (msg === 'ONLINE') {
            dev.online = true;
            dev.lastSeen = new Date().toISOString();
          } else if (msg === 'OFFLINE') {
            // Only set offline if we haven't received data recently
            const lastData = dev.lastSeen ? new Date(dev.lastSeen) : null;
            const now = new Date();
            if (!lastData || (now - lastData) > 30000) {
              dev.online = false;
            }
          }
        } else if (subtopic === 'error') {
          // Error messages don't set device online - just record the error
          dev.status = 'ERROR: ' + msg;
        }

        upd[deviceId] = dev;
        return upd;
      });

      setLastUpdate(new Date().toISOString());
    });

    client.on('error', (err) => {
      console.error('[Admin] Error:', err.message);
      if (isMountedRef.current) {
        setConnectionError(err.message);
        setIsConnected(false);
      }
    });

    client.on('close', () => {
      console.log('[Admin] Closed');
      if (isMountedRef.current) setIsConnected(false);
    });
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendCommand = useCallback((deviceId, cmd) => {
    if (!clientRef.current?.connected) return false;
    const topic = `telyuk${deviceId}/command`;
    const payload = JSON.stringify({ message: cmd });
    clientRef.current.publish(topic, payload, { qos: 0 });
    console.log('[Admin] Sent:', topic, payload);
    return true;
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clientRef.current?.end(true);
      clientRef.current = null;
    };
  }, []);

  const stats = {
    totalDevices: Object.keys(devices).length,
    onlineDevices: Object.values(devices).filter(d => d.online).length,
    offlineDevices: Object.values(devices).filter(d => !d.online).length,
    pumpOnCount: Object.values(devices).filter(d => d.pumpStatus === 'NYALA' || d.pumpStatus === 'ON').length,
    lowMoistureCount: Object.values(devices).filter(d => d.moisture !== null && d.moisture < 30).length,
    averageMoisture: (() => {
      const v = Object.values(devices).filter(d => d.moisture !== null).map(d => d.moisture);
      return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : 0;
    })()
  };

  return { isConnected, devices, stats, connectionError, lastUpdate, connect, disconnect, sendCommand };
}

export default useAdminMqtt;
