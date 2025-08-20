import { usePomodoro } from '../context/PomodoroContext';

export default function PomodoroStats() {
  const { stats } = usePomodoro();
  
  return (
    <div className="card">
      <h3>Pomodoro Statistics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.today}</div>
          <div style={{ color: 'var(--muted)' }}>Today</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalPomodoros}</div>
          <div style={{ color: 'var(--muted)' }}>Total</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalWorkTime}</div>
          <div style={{ color: 'var(--muted)' }}>Minutes</div>
        </div>
      </div>
    </div>
  );
}