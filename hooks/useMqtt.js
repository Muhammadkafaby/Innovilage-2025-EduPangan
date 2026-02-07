'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt from 'mqtt';
import { MQTT_CONFIG, getDeviceCredentials, getDeviceTopics, MQTT_COMMANDS } from '../lib/mqttConfig';

/**
 * MQTT Connection States
 */
export const MQTT_STATE = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

/**
 * Custom React Hook for MQTT connection management
 * @param {number} deviceNumber - Device number (1-26)
 * @returns {object} - MQTT state and control functions
 */
export function useMqtt(deviceNumber) {
  const [connectionState, setConnectionState] = useState(MQTT_STATE.DISCONNECTED);
  const [sensorData, setSensorData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const clientRef = useRef(null);
  const topicsRef = useRef(null);

  // Connect to MQTT broker
  const connect = useCallback(() => {
    if (!deviceNumber || deviceNumber < 1 || deviceNumber > 26) {
      setError('Invalid device number (must be 1-26)');
      return false;
    }

    const credentials = getDeviceCredentials(deviceNumber);
    const topics = getDeviceTopics(credentials.deviceId);
    topicsRef.current = topics;

    setConnectionState(MQTT_STATE.CONNECTING);
    setError(null);

    const connectOptions = {
      ...MQTT_CONFIG.options,
      username: credentials.username,
      password: credentials.password,
      clientId: `edupangan_${credentials.deviceId}_${Date.now()}`
    };

    console.log('[MQTT] Connecting to:', MQTT_CONFIG.brokerUrl);
    console.log('[MQTT] Device:', credentials.deviceId);

    const client = mqtt.connect(MQTT_CONFIG.brokerUrl, connectOptions);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('[MQTT] Connected successfully');
      setConnectionState(MQTT_STATE.CONNECTED);
      
      // Subscribe to device topics
      const subscribeTopics = [topics.data, topics.status, topics.error, topics.response];
      subscribeTopics.forEach(topic => {
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`[MQTT] Subscribe error for ${topic}:`, err);
          } else {
            console.log(`[MQTT] Subscribed to: ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`[MQTT] Message on ${topic}:`, payload);
        setLastUpdate(new Date());

        if (topic === topics.data) {
          setSensorData(payload);
        } else if (topic === topics.status) {
          setDeviceStatus(payload);
        } else if (topic === topics.error) {
          setError(payload.message || 'Device error');
        }
      } catch (e) {
        console.log(`[MQTT] Non-JSON message on ${topic}:`, message.toString());
        if (topic === topics.status) {
          setDeviceStatus({ status: message.toString() });
        }
      }
    });

    client.on('error', (err) => {
      console.error('[MQTT] Connection error:', err);
      setConnectionState(MQTT_STATE.ERROR);
      setError(err.message || 'Connection failed');
    });

    client.on('close', () => {
      console.log('[MQTT] Connection closed');
      if (connectionState !== MQTT_STATE.DISCONNECTED) {
        setConnectionState(MQTT_STATE.DISCONNECTED);
      }
    });

    client.on('reconnect', () => {
      console.log('[MQTT] Reconnecting...');
      setConnectionState(MQTT_STATE.CONNECTING);
    });

    return true;
  }, [deviceNumber]);

  // Disconnect from MQTT broker
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      console.log('[MQTT] Disconnecting...');
      clientRef.current.end();
      clientRef.current = null;
      setConnectionState(MQTT_STATE.DISCONNECTED);
      setSensorData(null);
      setDeviceStatus(null);
    }
  }, []);

  // Send command to device
  const sendCommand = useCallback((command) => {
    if (!clientRef.current || connectionState !== MQTT_STATE.CONNECTED) {
      console.error('[MQTT] Cannot send command - not connected');
      return false;
    }

    if (!topicsRef.current) {
      console.error('[MQTT] Topics not initialized');
      return false;
    }

    const payload = JSON.stringify(command);
    console.log(`[MQTT] Sending to ${topicsRef.current.command}:`, payload);
    
    clientRef.current.publish(topicsRef.current.command, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error('[MQTT] Publish error:', err);
      }
    });
    
    return true;
  }, [connectionState]);

  // Pump control functions
  const pumpOn = useCallback(() => sendCommand(MQTT_COMMANDS.PUMP_ON), [sendCommand]);
  const pumpOff = useCallback(() => sendCommand(MQTT_COMMANDS.PUMP_OFF), [sendCommand]);
  const pumpAuto = useCallback(() => sendCommand(MQTT_COMMANDS.PUMP_AUTO), [sendCommand]);
  const getDeviceInfo = useCallback(() => sendCommand(MQTT_COMMANDS.GET_INFO), [sendCommand]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  return {
    // State
    connectionState,
    isConnected: connectionState === MQTT_STATE.CONNECTED,
    isConnecting: connectionState === MQTT_STATE.CONNECTING,
    sensorData,
    deviceStatus,
    error,
    lastUpdate,
    
    // Actions
    connect,
    disconnect,
    sendCommand,
    pumpOn,
    pumpOff,
    pumpAuto,
    getDeviceInfo
  };
}

export default useMqtt;
