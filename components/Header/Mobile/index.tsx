"use client";

import * as React from "react";
import styles from './styles.module.scss'
import Link from "next/link";
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

import { useAuth } from "@/app/auth/AuthContext";

export default function HeaderMobile() {
  const { user, logout } = useAuth();
  const [value, setValue] = React.useState("home");
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <div className={styles.headerMobile}>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem component={Link} href="/" onClick={toggleDrawer(false)}>
              <ListItemText primary="Início" />
            </ListItem>

            {user?.role === "aluno" && (
              <>
                <ListItem
                  component={Link}
                  href="/matter/ui-ux"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary="UI/UX" />
                </ListItem>

                <ListItem
                  component={Link}
                  href="/matter/react"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary="React" />
                </ListItem>

                <ListItem
                  component={Link}
                  href="/matter/next"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary="Next" />
                </ListItem>
              </>
            )}

            <ListItem
              onClick={() => {
                toggleDrawer(false)();
                logout();
              }}
            >
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <BottomNavigation
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        className={styles.bottomNavigation}
      >
        <BottomNavigationAction
          value="menu"
          icon={<MenuIcon className={styles.icon} />}
          onClick={toggleDrawer(true)}
          className={styles.action}
        />

        <BottomNavigationAction
          value="home"
          icon={<HomeIcon className={styles.icon} />}
          component={Link}
          href="/"
          className={styles.action}
        />
      </BottomNavigation>
    </div>
  );
}