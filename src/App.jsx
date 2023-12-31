import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import SuccessPage from './SuccessPage';
import CancelPage from './CancelPage';
import LandingPage from './LandingPage';
import AccounUpdatetModal from './AccountUpdateModal';
import 'antd/dist/reset.css';
import { Menu } from 'antd'; // Importing Ant Design's Menu component
import { AccountProvider } from './AccountContext';
import { inject } from '@vercel/analytics';

inject();



function App() {
  const [session, setSession] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);  // New state variable for controlling the modal visibility
  const [selectedMenuKey, setSelectedMenuKey] = useState(''); // New state variable for controlling the active menu item                                                                                                                                                                                              


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router basename={import.meta.env.PUBLIC_URL}>
      <AccountProvider session={session}> {/* Wrap your component tree with AccountProvider */}
        <div className="flex flex-col h-screen w-screen bg-gray-100">
          {session && (
            <Menu mode="horizontal" className="flex justify-between" selectedKeys={[selectedMenuKey]}>                                                                                                                                                                                                                
              <Menu.Item key="account" onClick={() => { setIsModalVisible(true); setSelectedMenuKey('account'); }}><Link to="/">Account</Link></Menu.Item>                                                                                                                                                            
              {isModalVisible && <AccounUpdatetModal session={session} isVisible={isModalVisible} setVisible={(isVisible) => { setIsModalVisible(isVisible); if (!isVisible) setSelectedMenuKey(''); }} />}                                                                                                          
              <Menu.Item key="Spacer" disabled={true} style={{ flex: 1 }}></Menu.Item> {/* This will take up all available space, pushing the next item to the end */}
              <Menu.Item key="signOut" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Menu.Item>
            </Menu>
          )}
          <div className="flex-grow flex justify-center items-center bg-black">
            <Routes>
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="/" element={!session ? <Auth /> : <LandingPage key={session.user.id} session={session} />} />
            </Routes>
          </div>
          {isModalVisible && <AccounUpdatetModal session={session} isVisible={isModalVisible} setVisible={(isVisible) => { setIsModalVisible(isVisible); if (!isVisible) setSelectedMenuKey(''); }} />}                                                                                                               

        </div>
      </AccountProvider>
    </Router>

  );
}

export default App;
