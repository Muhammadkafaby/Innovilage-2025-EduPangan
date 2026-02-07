'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for managing garden data (activities, harvests, plants)
 * Data persists in localStorage
 */
export function useGardenData() {
  const [activities, setActivities] = useLocalStorage('edupangan_activities', []);
  const [harvests, setHarvests] = useLocalStorage('edupangan_harvests', []);
  const [plants, setPlants] = useLocalStorage('edupangan_plants', []);

  // Add a new activity (planting, watering, etc.)
  const addActivity = useCallback((activity) => {
    const newActivity = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...activity
    };
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  }, [setActivities]);

  // Add a harvest record
  const addHarvest = useCallback((harvest) => {
    const newHarvest = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...harvest
    };
    setHarvests(prev => [newHarvest, ...prev]);
    
    // Also add as activity
    addActivity({
      type: 'panen',
      plantName: harvest.plantType || harvest.plantName,
      quantity: harvest.quantity,
      unit: harvest.unit,
      status: 'selesai'
    });
    
    return newHarvest;
  }, [setHarvests, addActivity]);

  // Add a plant (when ordering from bank bibit)
  const addPlant = useCallback((plant) => {
    const newPlant = {
      id: Date.now(),
      plantedDate: new Date().toISOString(),
      status: 'tumbuh',
      ...plant
    };
    setPlants(prev => [newPlant, ...prev]);
    
    // Add planting activity
    addActivity({
      type: 'tanam',
      plantName: plant.name,
      quantity: plant.quantity,
      status: 'tumbuh',
      expectedHarvest: calculateHarvestDate(plant.growthPeriod)
    });
    
    return newPlant;
  }, [setPlants, addActivity]);

  // Update plant status
  const updatePlant = useCallback((plantId, updates) => {
    setPlants(prev => prev.map(p => 
      p.id === plantId ? { ...p, ...updates } : p
    ));
  }, [setPlants]);

  // Remove activity
  const removeActivity = useCallback((activityId) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
  }, [setActivities]);

  // Calculate stats
  const stats = useMemo(() => {
    const activePlants = plants.filter(p => p.status === 'tumbuh').length;
    const readyToHarvest = plants.filter(p => p.status === 'siap_panen').length;
    const totalHarvest = harvests.reduce((sum, h) => sum + (parseFloat(h.quantity) || 0), 0);
    const recentActivities = activities.slice(0, 5);
    
    return {
      activePlants,
      readyToHarvest,
      totalHarvest: totalHarvest.toFixed(1),
      recentActivities,
      totalActivities: activities.length,
      totalHarvests: harvests.length
    };
  }, [plants, harvests, activities]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setActivities([]);
    setHarvests([]);
    setPlants([]);
  }, [setActivities, setHarvests, setPlants]);

  return {
    // Data
    activities,
    harvests,
    plants,
    stats,
    
    // Actions
    addActivity,
    addHarvest,
    addPlant,
    updatePlant,
    removeActivity,
    clearAllData
  };
}

// Helper to calculate expected harvest date
function calculateHarvestDate(growthPeriod) {
  if (!growthPeriod) return null;
  
  // Parse "25-30 hari" format
  const match = growthPeriod.match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1]);
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + days);
    return harvestDate.toISOString().split('T')[0];
  }
  return null;
}

export default useGardenData;
