import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in</h2>
          <p>You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Profile</h2>
        <table className="table">
          <tbody>
            <tr><th>Name</th><td>{user.name}</td></tr>
            <tr><th>Email</th><td>{user.email}</td></tr>
            <tr><th>Mobile</th><td>{user.mobile || '-'}</td></tr>
            <tr><th>User ID</th><td>{user._id || user.id}</td></tr>
          </tbody>
        </table>
        <Link to="/profile/edit" className="btn mt-2">Edit Profile</Link>
      </div>
    </div>
  );
}