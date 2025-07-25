import React from 'react';
import homeIcon from '../assets/icons/Home.png';
import quranIcon from '../assets/icons/Quran.png';
import maktabIcon from '../assets/icons/Maktab.png';
import duaIcon from '../assets/icons/Duw.png';
import moreIcon from '../assets/icons/More.png';

const navItems = [
  { name: 'Home', icon: homeIcon },
  { name: 'Quran', icon: quranIcon },
   { name: 'More', icon: moreIcon },
  { name: 'Maktab', icon: maktabIcon },
  { name: 'Dua', icon: duaIcon },
];

const BottomNav = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      borderTop: '1px solid #ccc',
      fontFamily: 'sans-serif',
    }}>
      {navItems.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: index === 0 ? '#8b5cf6' : '#333',
          fontWeight: index === 0 ? 600 : 400,
        }}>
          <img src={item.icon} alt={item.name} style={{ width: 30, height: 30 , marginBottom: 4 }} />
          <div style={{ fontSize: '12px' }}>{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
