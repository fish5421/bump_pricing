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
                    // console.log('context data', data);
                    setAccountData(data);
                } else {
                    console.error('Failed to fetch account data', error);
                }
            }
        };

        fetchAccountData();
    }, [session]);

    const updateAccountData = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (data) {
            setAccountData(data);
        } else {
            console.error('Failed to update account data', error);
        }
    };


    return (
        <AccountContext.Provider value={{ accountData, setAccountData, updateAccountData }}>
            {children}
        </AccountContext.Provider>
    );
};