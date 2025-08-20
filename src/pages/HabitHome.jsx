import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HabitHome() {
  const { user, habits } = useAuth();
  const totalCompleted = habits.reduce((sum, habit) => sum + habit.completionDates.length, 0);
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);

  return (
    <div className="container">
      <div className="card">
        <h1>HabitBuilder AI 🚀</h1>
        <p>Build positive habits and break negative ones with AI-powered insights and recommendations.</p>
        
        {user ? (
          <div className="mt-3">
            <h2>Welcome back, {user.name}!</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
              <div className="card center">
                <h3>{habits.length}</h3>
                <p>Active Habits</p>
              </div>
              <div className="card center">
                <h3>{totalCompleted}</h3>
                <p>Total Completions</p>
              </div>
              <div className="card center">
                <h3>{currentStreak}</h3>
                <p>Current Streak</p>
              </div>
            </div>
            
            <div className="flex mt-3" style={{ gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/habit" className="btn">Manage Habits</Link>
              <Link to="/ai-recommendations" className="btn">Get AI Suggestions</Link>
              <Link to="/analytics" className="btn secondary">View Analytics</Link>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p>Join thousands of users who are transforming their lives one habit at a time.</p>
            <div className="flex mt-2" style={{ gap: '12px' }}>
              <Link to="/signup" className="btn">Get Started</Link>
              <Link to="/login" className="btn secondary">Login</Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div className="card">
          <h3>🤖 AI-Powered</h3>
          <p>Get personalized habit recommendations based on your goals and current patterns.</p>
        </div>
        <div className="card">
          <h3>📊 Smart Analytics</h3>
          <p>Track your progress with detailed analytics and streak monitoring.</p>
        </div>
        <div className="card">
          <h3>💫 Motivation</h3>
          <p>Receive AI-generated motivational messages to keep you on track.</p>
        </div>
      </div>
    </div>
  );
}