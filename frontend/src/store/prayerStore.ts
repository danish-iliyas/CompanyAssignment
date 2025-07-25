import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Prayer {
  icon: string;
  name: string;
  time: string;
  color: string[];
}

interface PrayerStore {
  prayers: Prayer[];
  selectedCity: string;
  selectedLat: number;
  selectedLon: number;

  setPrayers: (prayers: Prayer[]) => void;
  setLocation: (city: string, lat: number, lon: number) => void;
}

export const usePrayerStore = create<PrayerStore>()(
  persist(
    (set) => ({
      prayers: [],
      selectedCity: '',
      selectedLat: 0,
      selectedLon: 0,
      setPrayers: (prayers) => set({ prayers }),
      setLocation: (city, lat, lon) => set({ selectedCity: city, selectedLat: lat, selectedLon: lon }),
    }),
    { name: 'prayer-store' }
  )
);
