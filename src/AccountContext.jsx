import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AccountContext = createContext();

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};

export const AccountProvider = ({ children, session }) => {
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        const fetchAccountData = async () => {
            if (session && session.user) {
                const { user } = session;
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    console.log('context data', data);
                    setAccountData(data);
                } else {
                    console.error('Failed to fetch account data', error);
                }
            }
        };

        fetchAccountData();
    }, [session]);

    return (
        <AccountContext.Provider value={{ accountData, setAccountData }}>
            {children}
        </AccountContext.Provider>
    );
};