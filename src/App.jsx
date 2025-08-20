
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Tasks from './pages/Tasks';
import TextToPdf from './pages/TextToPdf';
import WordToPdf from './pages/WordToPdf';
import TextToWord from './pages/TextToWord';
import ImageConverter from './pages/ImageConverter';
import PomodoroPage from './pages/PomodoroPage';
import BMR from './pages/BMR';
import MoneyManagement from './pages/MoneyManagement';  
import Notes from './pages/Note';
import CalorieTracker from './pages/CalorieTracker';
import AIRecommendations from './pages/AIRecommendations';
import Analytics from './pages/Analytics';
import HabitHome from './pages/HabitHome';


import { useAuth } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import Habits from './pages/Habits';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <TasksProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/profile/edit" element={<Protected><EditProfile /></Protected>} />
          <Route path="/task-manager" element={<Protected><Tasks /></Protected>} />
             {/* Converter routes - no authentication required */}
        <Route path="/text-to-pdf" element={<TextToPdf />} />
          <Route path="/text-to-word" element={<TextToWord />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
         <Route path="/imageconverter" element={<ImageConverter />} />

        {/**health tools */}
          <Route path="/bmr" element={<Protected><BMR /></Protected>} />
          <Route path="/calorie-tracker" element={<Protected><CalorieTracker /></Protected>} />
          {/** management Tools */}
          <Route path="/money-management" element={<MoneyManagement />} />
          <Route path="/notes" element={<Protected><Notes /></Protected>} />
          <Route path="/pomodoro" element={<Protected><PomodoroPage /></Protected>} />

          
          <Route path="/habits" element={<Protected><HabitHome /></Protected>} />
          <Route path="/ai-recommendations" element={<Protected><AIRecommendations /></Protected>} />
          <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
           <Route path="/habit" element={<Protected><Habits /></Protected>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </TasksProvider>
    </>
  );
}