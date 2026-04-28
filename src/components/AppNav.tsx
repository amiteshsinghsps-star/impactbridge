import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  label: string;
  href: string;
}

const coordinatorNav: NavItem[] = [
  { label: 'Command', href: '/dashboard' },
  { label: 'Needs', href: '/needs' },
  { label: 'Volunteers', href: '/volunteers' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings', href: '/settings' },
];

const volunteerNav: NavItem[] = [
  { label: 'Home', href: '/volunteer' },
  { label: 'Discover', href: '/volunteer/discover' },
  { label: 'My Tasks', href: '/volunteer/tasks' },
  { label: 'Impact', href: '/volunteer/impact' },
];

const reporterNav: NavItem[] = [
  { label: 'Dashboard', href: '/reporter' },
  { label: 'Submit Need', href: '/needs/submit' },
];

export default function AppNav() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = profile?.role === 'coordinator' ? coordinatorNav : profile?.role === 'reporter' ? reporterNav : volunteerNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        height: '60px',
        background: '#000',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <Link
        to={profile?.role === 'coordinator' ? '/dashboard' : '/volunteer'}
        style={{ textDecoration: 'none' }}
      >
        <span
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          ImpactBridge
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navItems.map((item, i) => {
          const active = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link
                to={item.href}
                style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  color: active ? '#fff' : '#fff',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  borderBottom: active ? '1px solid #fff' : '1px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }
                }}
              >
                {item.label}
              </Link>
              {i < navItems.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>
              )}
            </span>
          );
        })}

        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: '10px',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {profile?.firstName} · {profile?.role}
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '10px',
              fontWeight: 400,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'transparent',
              border: '1px solid #fff',
              padding: '4px 12px',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#fff';
              el.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#fff';
              el.style.color = '#fff';
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </nav>
  );
}
