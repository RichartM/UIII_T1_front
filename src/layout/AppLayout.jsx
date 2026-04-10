import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
