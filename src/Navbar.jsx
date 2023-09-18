// Navbar.js
import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Navbar ({ session }) {
    const location = useLocation();
    const isSelected = location.pathname === '/' ? ['account'] : [];

    return (
        <Menu mode="horizontal" selectedKeys={isSelected} className="flex justify-between">
            <Menu.Item key="account"><Link to="/">Account</Link></Menu.Item>
            <div className="ml-auto"></div>
            <Menu.Item key="signOut" onClick={() => supabase.auth.signOut()}>Sign Out</Menu.Item>
        </Menu>
    );
};

