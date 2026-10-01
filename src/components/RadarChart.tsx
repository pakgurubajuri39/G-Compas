import React, { useState } from 'react';
import { GardnerScores } from '../types';

interface RadarChartProps {
  scores: GardnerScores;
  size?: number;
  showLabels?: boolean;
}

interface AxisPoint {
  key: keyof GardnerScores;
  label: string;
  shortLabel: string;
  icon: string;
  angle: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 420, showLabels = true }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; score: number; x: number; y: number } | null>(null);

  const center = size / 2;
  const radius = (size / 2) - 58;

  const axes: AxisPoint[] = [
    { key: 'logical', label: 'Logis-Matematis', shortLabel: 'Logika', icon: '⚡', angle: -Math.PI / 2 },
    { key: 'spatial', label: 'Visual-Spasial', shortLabel: 'Spasial', icon: '🎨', angle: -Math.PI / 4 },
    { key: 'naturalist', label: 'Naturalis', shortLabel: 'Naturalis', icon: '🌿', angle: 0 },
    { key: 'interpersonal', label: 'Interpersonal', shortLabel: 'Sosial', icon: '🤝', angle: Math.PI / 4 },
    { key: 'linguistic', label: 'Linguistik-Verbal', shortLabel: 'Bahasa', icon: '📖', angle: Math.PI / 2 },
    { key: 'kinesthetic', label: 'Kinestetik-Badani', shortLabel: 'Kinestetik', icon: '🏃', angle: (3 * Math.PI) / 4 },
    { key: 'musical', label: 'Musikal-Ritmik', shortLabel: 'Musikal', icon: '🎵', angle: Math.PI },
    { key: 'intrapersonal', label: 'Intrapersonal', shortLabel: 'Refleksi', icon: '🧘', angle: -(3 * Math.PI) / 4 },
  ];

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper for coordinates
  const getCoordinates = (angle: number, distance: number) => {
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  // Compute polygon points for the student's scores
  const scorePoints = axes.map(axis => {
    const val = scores[axis.key] || 0;
    const distance = (val / 100) * radius;
    return {
      ...getCoordinates(axis.angle, distance),
      score: val,
      label: axis.label,
      shortLabel: axis.shortLabel,
    };
  });

  const polygonPath = scorePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[460px] mx-auto select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto drop-shadow-xl overflow-visible"
      >
        <defs>
          {/* Radial & linear gradients for futuristic neon effect */}
          <radialGradient id="radarRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Web Rings */}
        {levels.map((level, idx) => {
          const ringPoints = axes.map(axis => {
            const coord = getCoordinates(axis.angle, radius * level);
            return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`;
          }).join(' ');

          return (
            <g key={idx}>
              <polygon
                points={ringPoints}
                fill={idx % 2 === 0 ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.2)'}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
                strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
              />
              {/* Level indicator percentage on top axis */}
              <text
                x={center}
                y={center - radius * level - 2}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(148, 163, 184, 0.6)"
                fontWeight="500"
              >
                {Math.round(level * 100)}%
              </text>
            </g>
          );
        })}

        {/* Radial Axis Spokes */}
        {axes.map((axis, i) => {
          const coord = getCoordinates(axis.angle, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coord.x}
              y2={coord.y}
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* The Filled Data Polygon */}
        <polygon
          points={scorePoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
          fill="url(#radarRadial)"
          stroke="url(#strokeGradient)"
          strokeWidth="3"
          filter="url(#neonGlow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertices (Interactive Dots) */}
        {scorePoints.map((point, i) => (
          <g
            key={i}
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPoint({ label: point.label, score: point.score, x: point.x, y: point.y })}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#0f172a"
              stroke="#a855f7"
              strokeWidth="2.5"
              className="transition-transform group-hover:scale-150 duration-200"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="#38bdf8"
            />
          </g>
        ))}

        {/* Axis Labels */}
        {showLabels && axes.map((axis, i) => {
          const labelDist = radius + 32;
          const coord = getCoordinates(axis.angle, labelDist);
          const score = scores[axis.key];

          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (coord.x > center + 15) textAnchor = 'start';
          if (coord.x < center - 15) textAnchor = 'end';

          return (
            <g key={i}>
              <text
                x={coord.x}
                y={coord.y - 4}
                textAnchor={textAnchor}
                className="text-[11px] font-semibold fill-slate-200"
              >
                {axis.icon} {axis.shortLabel}
              </text>
              <text
                x={coord.x}
                y={coord.y + 10}
                textAnchor={textAnchor}
                className="text-[10px] font-bold fill-cyan-400"
              >
                {score}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute pointer-events-none z-20 bg-slate-900/90 border border-purple-500/50 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md transition-all"
          style={{
            left: `${(hoveredPoint.x / size) * 100}%`,
            top: `${(hoveredPoint.y / size) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold text-purple-300">{hoveredPoint.label}</div>
          <div className="text-cyan-400 font-bold text-sm">{hoveredPoint.score} / 100 Poin</div>
        </div>
      )}
    </div>
  );
};
