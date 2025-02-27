import { ReactNode, useState } from 'react';
import { 
AppBar, 
Box, 
CssBaseline, 
Divider, 
Drawer, 
IconButton, 
List, 
ListItem, 
ListItemButton, 
ListItemIcon, 
ListItemText, 
Toolbar, 
Typography, 
useTheme,
useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

interface MainLayoutProps {
children: ReactNode;
title?: string;
}

const MainLayout = ({ children, title = 'Admin Panel' }: MainLayoutProps) => {
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const [mobileOpen, setMobileOpen] = useState(false);

const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
};

const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const drawer = (
    <Box>
    <Toolbar>
        <Typography variant="h6" noWrap component="div">
        Admin Panel
        </Typography>
    </Toolbar>
    <Divider />
    <List>
        {navigationItems.map((item) => (
        <ListItem key={item.text} disablePadding>
            <ListItemButton>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            </ListItemButton>
        </ListItem>
        ))}
    </List>
    <Divider />
    <List>
        <ListItem disablePadding>
        <ListItemButton>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
        </ListItemButton>
        </ListItem>
    </List>
    </Box>
);

return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar
        position="fixed"
        sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        }}
    >
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
        >
            <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
            {title}
        </Typography>
        </Toolbar>
    </AppBar>
    <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
        {/* Mobile drawer */}
        <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
            keepMounted: true, // Better open performance on mobile
        }}
        sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        >
        {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
        variant="permanent"
        sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
        p: 3, 
        width: { md: `calc(100% - ${drawerWidth}px)` },
        mt: '64px', // Account for AppBar height
        }}
    >
        {children}
    </Box>
    </Box>
);
};

export default MainLayout;

