import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import SuccessPage from './SuccessPage';
import CancelPage from './CancelPage';
import 'antd/dist/reset.css';

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
    <Router>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/" element={!session ? <Auth /> : <Account key={session.user.id} session={session} />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
