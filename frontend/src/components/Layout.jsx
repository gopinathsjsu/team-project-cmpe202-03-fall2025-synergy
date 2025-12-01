import * as React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, CssBaseline, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, AppBar as MuiAppBar, Drawer as MuiDrawer, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList'; import ReportIcon from '@mui/icons-material/Report';
import GroupIcon from '@mui/icons-material/Group'; import SettingsIcon from '@mui/icons-material/Settings';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../state/AuthContext'; import { ColorModeContext } from '../theme';
const drawerWidth=240;
const opened=(t)=>({width:drawerWidth,transition:t.transitions.create('width'),overflowX:'hidden'});
const closed=(t)=>({transition:t.transitions.create('width'),overflowX:'hidden',width:'72px'});
const DrawerHeader=styled('div')(({theme:t})=>({display:'flex',alignItems:'center',justifyContent:'space-between',padding:t.spacing(0,1),...t.mixins.toolbar}));
const AppBar=styled(MuiAppBar)(({open})=>({zIndex:1300,color:'#fff',backgroundImage:'linear-gradient(90deg,#7C4DFF,#00E5FF)',...(open&&{marginLeft:drawerWidth,width:`calc(100% - ${drawerWidth}px)`})}));
const Drawer=styled(MuiDrawer,{shouldForwardProp:(p)=>p!=='open'})(({theme:t,open})=>({width:drawerWidth,whiteSpace:'nowrap',boxSizing:'border-box',...(open&&{...opened(t),'& .MuiDrawer-paper':{...opened(t),borderRight:0, background:'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))', backdropFilter:'blur(10px)'}}),...(!open&&{...closed(t),'& .MuiDrawer-paper':{...closed(t),borderRight:0}})}));
export default function Layout(){
  const [open,setOpen]=React.useState(true); const {user,logout}=useAuth(); const nav=useNavigate(); const loc=useLocation(); const color=React.useContext(ColorModeContext);
  const items=[{to:'/dashboard',label:'Overview',icon:<DashboardIcon/>,roles:['admin']},{to:'/listings',label:'Listings',icon:<ViewListIcon/>,roles:['admin']},{to:'/reports',label:'Reports',icon:<ReportIcon/>,roles:['admin']},{to:'/users',label:'Users',icon:<GroupIcon/>,roles:['admin']},{to:'/settings',label:'Settings',icon:<SettingsIcon/>,roles:['admin','seller','buyer']}];
  const sidebar=items.filter(i=>!user || i.roles.includes(user.role));
  return (<Box sx={{display:'flex',minHeight:'100vh'}}>
    <CssBaseline/>
    <AppBar position="fixed" open={open}><Toolbar><IconButton onClick={()=>setOpen(!open)} edge="start" sx={{mr:2,color:'#fff'}}><MenuIcon/></IconButton>
      <Typography variant="h6" sx={{flexGrow:1}}>Spartan Exchange • Admin</Typography>
      <Tooltip title="Toggle light/dark"><IconButton color="inherit" onClick={color.toggleColorMode} sx={{mr:1}}><Brightness7Icon/></IconButton></Tooltip>
      {user && <Typography sx={{mr:2}}>{user.name} ({user.role})</Typography>}
      {user && <Button variant="outlined" color="inherit" onClick={()=>{logout();nav('/login');}}>Logout</Button>}
    </Toolbar></AppBar>
    <Drawer variant="permanent" open={open}><DrawerHeader><Typography sx={{ml:1,fontWeight:700,color:'primary.main'}}>Admin</Typography></DrawerHeader><Divider/>
      <List>{sidebar.map(it=>{const active=loc.pathname===it.to; return (<ListItem key={it.to} disablePadding sx={{display:'block'}}>
        <ListItemButton component={Link} to={it.to} selected={active} sx={{minHeight:48,px:2.5}}>
          <ListItemIcon sx={{minWidth:0,mr:2}}>{it.icon}</ListItemIcon><ListItemText primary={it.label}/>
        </ListItemButton></ListItem>);})}</List></Drawer>
    <Box component="main" sx={{flexGrow:1,p:3}}><DrawerHeader/><Outlet/></Box>
  </Box>);
}
