import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Popover,
    Switch,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';

const drawerWidth = 280;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const menuItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/mao-admin-panel' },
  { text: 'Tasks', icon: <FormatListBulletedRoundedIcon />, path: '/mao-admin-panel/tasks' },
  { text: 'Attendance', icon: <AccessTimeRoundedIcon />, path: '/mao-admin-panel/attendance' },
  { text: 'Rewards', icon: <EmojiEventsRoundedIcon />, path: '/mao-admin-panel/rewards' },
];

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Handle search
      setSearchAnchor(null);
    }
  };

  const notifications = [
    { id: 1, title: 'New Task Assigned', message: 'You have a new task to review', time: '5m ago' },
    { id: 2, title: 'Meeting Reminder', message: 'Team meeting in 30 minutes', time: '30m ago' },
    { id: 3, title: 'Project Update', message: 'Project status has been updated', time: '1h ago' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(44, 44, 46, 0.5)',
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={(e) => setUserMenuAnchor(e.currentTarget)}
        >
          R
        </Avatar>
        <Typography variant="subtitle1" fontWeight="600" sx={{ letterSpacing: '-0.025em' }}>
          Restaurant Admin
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              mb: 0.5,
              animation: `${fadeIn} 0.3s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&.Mui-selected': {
                  backgroundColor: mode === 'light'
                    ? 'rgba(0, 122, 255, 0.08)'
                    : 'rgba(10, 132, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    backgroundColor: mode === 'light'
                      ? 'rgba(0, 122, 255, 0.12)'
                      : 'rgba(10, 132, 255, 0.12)',
                  },
                },
                '&:hover': {
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'neutral.main',
                  minWidth: 40,
                  transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    letterSpacing: '-0.025em',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightModeRoundedIcon sx={{ color: 'neutral.main' }} />
          <Switch
            checked={mode === 'dark'}
            onChange={toggleTheme}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'primary.main',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'primary.main',
              },
            }}
          />
          <DarkModeRoundedIcon sx={{ color: 'neutral.main' }} />
        </Box>
      </Box>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              mx: 0.5,
              mb: 0.5,
              typography: 'body2',
              fontWeight: 500,
              letterSpacing: '-0.011em',
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(25px) saturate(200%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                animation: `${fadeIn} 0.3s ease-out`,
              }}
            >
              {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton
                onClick={(e) => setSearchAnchor(e.currentTarget)}
                sx={{
                  color: 'neutral.main',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: 'primary.main',
                  },
                }}
              >
                <SearchRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                onClick={(e) => setNotificationsAnchor(e.currentTarget)}
                sx={{
                  color: 'neutral.main',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: 'primary.main',
                  },
                }}
              >
                <Badge badgeContent={notifications.length} color="primary">
                  <NotificationsRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(searchAnchor)}
        anchorEl={searchAnchor}
        onClose={() => setSearchAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 320,
            mt: 1,
          },
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SearchRoundedIcon sx={{ color: 'neutral.main' }} />
          <InputBase
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            sx={{
              flex: 1,
              '& input': {
                typography: 'body1',
                letterSpacing: '-0.011em',
              },
            }}
          />
        </Paper>
      </Popover>

      <Popover
        open={Boolean(notificationsAnchor)}
        anchorEl={notificationsAnchor}
        onClose={() => setNotificationsAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List sx={{ px: 0 }}>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.id}
                sx={{
                  px: 0,
                  '&:not(:last-child)': {
                    mb: 1,
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ mt: 1 }} />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}