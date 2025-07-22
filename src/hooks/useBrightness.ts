import { useState, useEffect, useCallback } from "react";

export const useBrightness = () => {
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    // Load saved brightness from localStorage
    const savedBrightness = localStorage.getItem('app-brightness');
    if (savedBrightness) {
      const value = parseInt(savedBrightness);
      setBrightness(value);
      applyBrightness(value);
    }
  }, []);

  const applyBrightness = useCallback((value: number) => {
    // Apply brightness filter to the entire document
    const brightnessValue = value / 100;
    document.documentElement.style.filter = `brightness(${brightnessValue})`;
    
    // Also adjust the CSS custom properties for a more refined control
    const contrastAdjustment = 1 + (100 - value) / 500; // Subtle contrast adjustment
    document.documentElement.style.setProperty('--brightness-filter', `brightness(${brightnessValue}) contrast(${contrastAdjustment})`);
  }, []);

  const updateBrightness = useCallback((value: number) => {
    setBrightness(value);
    applyBrightness(value);
    localStorage.setItem('app-brightness', value.toString());
  }, [applyBrightness]);

  const toggleBrightness = useCallback(() => {
    const newValue = brightness <= 70 ? 100 : 60;
    updateBrightness(newValue);
    return newValue;
  }, [brightness, updateBrightness]);

  const resetBrightness = useCallback(() => {
    updateBrightness(100);
    localStorage.removeItem('app-brightness');
  }, [updateBrightness]);

  return {
    brightness,
    updateBrightness,
    toggleBrightness,
    resetBrightness,
    applyBrightness
  };
};