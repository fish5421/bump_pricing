import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import SuccessPage from './SuccessPage';
import CancelPage from './CancelPage';
import 'antd/dist/reset.css';
import { Menu } from 'antd'; // Importing Ant Design's Menu component


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="flex flex-col h-screen w-screen bg-gray-100">
        <Menu mode="horizontal">
          <Menu.Item key="home"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="success"><Link to="/success">Success</Link></Menu.Item>
          <Menu.Item key="cancel"><Link to="/cancel">Cancel</Link></Menu.Item>
        </Menu>
        <div className="flex-grow flex justify-center items-center">
          <Routes>
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/" element={!session ? <Auth /> : <Account key={session.user.id} session={session} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
