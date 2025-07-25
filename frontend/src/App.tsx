import React, { useEffect, useState } from 'react';
import { usePrayerStore } from './store/prayerStore'; // your zustand store file
import PrayerTimesCard from './components/PrayerTimesCard';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

import fajrIcon from './assets/fazar.png';
import dhuhrIcon from './assets/dhuhr.png';
import asrIcon from './assets/asar.png';
import maghribIcon from './assets/magrib.png';
import ishaIcon from './assets/isha.png';

const cities = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToDiff = (diff: number): string => {
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h ${minutes}m`;
};

const App: React.FC = () => {
  const { prayers, setPrayers, selectedCity, selectedLat, selectedLon, setLocation } = usePrayerStore();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrayerTimes = async (lat: number, lon: number) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // yyyy-mm-dd
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1&shafaq=general`;
    const res = await fetch(url);
    const data = await res.json();

    const timings = data.data.timings;
    const newPrayers = [
      { icon: fajrIcon, name: 'Fajr', time: timings.Fajr, color: ['#4facfe', '#00f2fe'] },
      { icon: dhuhrIcon, name: 'Dhuhr', time: timings.Dhuhr, color: ['#f7971e', '#ffd200'] },
      { icon: asrIcon, name: 'Asr', time: timings.Asr, color: ['#11998e', '#38ef7d'] },
      { icon: maghribIcon, name: 'Maghrib', time: timings.Maghrib, color: ['#f953c6', '#b91d73'] },
      { icon: ishaIcon, name: 'Isha', time: timings.Isha, color: ['#7f00ff', '#e100ff'] },
    ];
    setPrayers(newPrayers);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let lat = selectedLat;
      let lon = selectedLon;

      if (!lat || !lon) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            setLocation('', lat, lon);
            resolve();
          }, () => resolve()); // resolve anyway if denied
        });
      }

      if (lat && lon) {
        await fetchPrayerTimes(lat, lon);
      }
      setLoading(false);
    };
    load();
  }, [selectedCity, selectedLat, selectedLon]);

  // calculate current & next prayer
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let currentPrayerIndex = -1;
  for (let i = prayers.length - 1; i >= 0; i--) {
    if (timeToMinutes(prayers[i].time) <= nowMinutes) {
      currentPrayerIndex = i;
      break;
    }
  }
  if (currentPrayerIndex === -1) currentPrayerIndex = prayers.length - 1;

  const currentPrayer = prayers[currentPrayerIndex];
  const nextPrayer = prayers[(currentPrayerIndex + 1) % prayers.length];

  const diffInMinutes = nextPrayer ? (timeToMinutes(nextPrayer.time) - nowMinutes + 1440) % 1440 : 0;
  const nextPrayerIn = formatMinutesToDiff(diffInMinutes);

  return (
    <div style={{  }}>
      <Header />
      {/* <div style={{ margin: '16px 0' }}>
        <select
          value={selectedCity}
          onChange={(e) => {
            const city = cities.find(c => c.name === e.target.value);
            if (city) setLocation(city.name, city.lat, city.lon);
            else setLocation('', 0, 0); // auto detect
          }}
          style={{ width: '100%', padding: 8, fontSize: 14 }}
        >
          <option value="">Auto detect location</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div> */}

      {loading ? (
        <div>Loading prayer times...</div>
      ) : (
        <PrayerTimesCard 
        
          prayers={prayers}
          currentPrayerName={currentPrayer?.name || ''}
          currentPeayerIcon={currentPrayer ? <img src={currentPrayer.icon} alt="" style={{ width: 40 }} /> : undefined}
          nextPrayerIn={nextPrayerIn}
          day={now.toLocaleDateString('en-US', { weekday: 'long' })}
        />
      )}
      <BottomNav />
    </div>
  );
};

export default App;
