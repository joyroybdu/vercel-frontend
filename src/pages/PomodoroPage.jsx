import { useAuth } from '../context/AuthContext';
import PomodoroTimer from '../components/PomodoroTimer';
import PomodoroStats from '../components/PomodoroStats';
import PomodoroSettings from '../components/PomodoroSettings';

export default function PomodoroPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in</h2>
          <p>You need to be logged in to use the Pomodoro Timer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <div>
          <PomodoroTimer />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PomodoroStats />
          <PomodoroSettings />
        </div>
      </div>
    </div>
  );
}