import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import mapIcon from '../assets/map-pin-fill.png';

import { usePrayerStore } from '../store/prayerStore';

const Header: React.FC = () => {
  const { selectedCity, setLocation } = usePrayerStore();
  const [address, setAddress] = useState<string>('Fetching your location...');
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Auto detect location on mount if no selectedCity
  useEffect(() => {
    if (!selectedCity) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;
          setAddress(city);
          setLocation(city, lat, lon);
        },
        () => {
          setAddress('Location unavailable');
        }
      );
    } else {
      setAddress(selectedCity);
    }
  }, [selectedCity, setLocation]);

  // Search locations dynamically
  useEffect(() => {
    if (search.trim().length > 2) {
      const fetchResults = async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${search}&limit=5`
        );
        const data = await res.json();
        setResults(data);
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [search]);

  const handleSelect = (place: any) => {
    setLocation(place.display_name, parseFloat(place.lat), parseFloat(place.lon));
    setAddress(place.display_name);
    setSearch('');
    setResults([]);
    setShowSearch(false);
  };

  return (
    <div
      style={{
        padding: '16px',
        background: 'white',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #eaeaea',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={logo} alt="logo" height="40" />
        <div style={{ textAlign: 'right' }}>
          {showSearch ? (
            <input
              type="text"
              autoFocus
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              style={{
                fontSize: 14,
                padding: '6px 8px',
                border: '1px solid #ccc',
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setShowSearch(true)}
            >
              Select Location
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#8A57DC',display: 'flex', alignItems: 'center', marginTop: 2,gap: 4 }}>
            <img src={mapIcon} alt="icon" srcset="" />
            {/* {mapIcon} */}
             <p>{address}</p></div>
        </div>
      </div>

      {/* Show search results below */}
      {showSearch && results.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: '4px 0 0',
            padding: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            maxHeight: 150,
            overflowY: 'auto',
          }}
        >
          {results.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              style={{
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Header;
