import React from 'react';

interface Prayer {
  icon: string;
  name: string;
  time: string; // "HH:mm"
  color: string[];
}

interface Props {
  prayers: Prayer[];
  currentPrayerName: string;
  currentPeayerIcon?: JSX.Element;
  nextPrayerIn: string;
  day: string;
}

const PrayerTimesCard: React.FC<Props> = ({
  prayers,
  currentPrayerName,
  currentPeayerIcon,
  nextPrayerIn,
  day,
}) => {
  const currentIndex = prayers.findIndex(p => p.name === currentPrayerName);
  const now = new Date();

  const getPrayerDate = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  let progress = 0;
 if (currentIndex >= 0) {
  const currentPrayerTime = getPrayerDate(prayers[currentIndex].time);
  let nextPrayerTime: Date;

  if (currentIndex === prayers.length - 1) {
    // Last prayer (Isha): next is Fajr tomorrow
    nextPrayerTime = getPrayerDate(prayers[0].time);
    nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
  } else {
    nextPrayerTime = getPrayerDate(prayers[currentIndex + 1].time);
  }

  const duration = nextPrayerTime.getTime() - currentPrayerTime.getTime();
  const passed = now.getTime() - currentPrayerTime.getTime();
  progress = Math.min(Math.max(passed / duration, 0), 1);
}


  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(" ");
  }

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const createArcSegment = (index: number, part: number = 1) => {
    const radius = 120; // Radius of the arc
    const centerX = 130;
    const centerY = 130;

    const segmentAngle = 22;
    const gapAngle = 11;

    // Left → right, clockwise
    const startAngle = -90 + 14 + index * (segmentAngle + gapAngle);
    const endAngle = startAngle + segmentAngle * part;

    return describeArc(centerX, centerY, radius, startAngle, endAngle);
  };
   const currentPrayerData = prayers.find(p => p.name === currentPrayerName);
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 360,
        margin: '0 auto',
        height: 370,
        background: `linear-gradient(135deg, ${currentPrayerData?.color[0]}, ${currentPrayerData?.color[1]})`,
        borderRadius: 16,
        color: 'white',
        padding: 16,
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        marginTop: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {currentPeayerIcon}
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{currentPrayerName}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Next prayer in {nextPrayerIn}</div>
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          padding: '2px 8px',
          fontSize: 12,
        }}>
          {day}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        {prayers.map((prayer, idx) => {
          const isCurrent = prayer.name === currentPrayerName;
          return (
            <div key={idx} style={{
              textAlign: 'center',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: isCurrent ? 1 : 0.5,
            }}>
              <img src={prayer.icon} alt={prayer.name} style={{
                width: 24, height: 24, marginBottom: 4,
                filter: isCurrent ? 'none' : 'grayscale(40%)',
              }} />
              <div style={{ fontSize: 12 }}>{prayer.name}</div>
              <div style={{ fontSize: 12 }}>{prayer.time}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <svg width="100%" height="140" viewBox="0 0 255 90">
          {[...Array(5)].map((_, idx) => {
            const bgPath = createArcSegment(idx, 1);
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <g key={idx}>
                <path d={bgPath} stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" strokeLinecap="round" />
                {isPast && (
                  <path d={bgPath} stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                )}
                {isCurrent && progress > 0 && (
                  <path d={createArcSegment(idx, progress)} stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default PrayerTimesCard;
