import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import SubscriptionPage from './SubscriptionPage'; // Make sure the path is correct


export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [businessName, setBusinessName] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);



    const handleSubscriptionClick = async () => {
        if (isSubscribed) {
            console.log('cancel now');
            window.location.href = 'https://billing.stripe.com/p/login/test_28oeVY8Uq6d410c9AA'
           
        } else {
            console.log('set now');
            setShowSubscriptionPage(true)
        }
    };

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('profiles')
                .select('username, business_name')
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn(error);
            } else if (data) {
                console.log('data', data);
                setUsername(data.username);
                setBusinessName(data.business_name);
            }

            setLoading(false);
        }

        getProfile();
    }, [session]);

    async function updateProfile(event) {
        event.preventDefault();

        setLoading(true);
        const { user } = session;

        const updates = {
            id: user.id,
            username,
            business_name: businessName,
            updated_at: new Date(),
        };

        let { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        async function fetchSubscription() {
            console.log('fetch subs', session);
            const { user } = session;
            const cleanedUserId = user.id.trim();  // Trim whitespaces and newlines
            console.log('cleaned_user_id', cleanedUserId);


            const { data, error } = await supabase
                .from('subscriptions')
                .select('active')
                .eq('subscriber_id', cleanedUserId)
                .eq('active', 'TRUE')
                .single();


            if (data && data.active) {
                console.log('data_7', data);
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
                console.log('data_7', data);

            }
        }

        fetchSubscription();
    }, [session]);


    return (
        showSubscriptionPage ? (
            <SubscriptionPage session={session} />
        ) : (
            <>
                <form onSubmit={updateProfile} className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
                    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                        {/* Existing form fields */}
                        <div className="mb-4 w-full text-black">
                            {/* ... */}
                        </div>
                        <div className="mb-4 w-full text-black">
                            {/* ... */}
                        </div>
                        <div className="mb-4 w-full text-black">
                            {/* ... */}
                        </div>
                        {/* Button Group */}
                        <div className="mb-4 w-full flex flex-col sm:flex-row sm:justify-between">
                            {/* Update button */}
                            <button type="submit" disabled={loading} className="mb-2 sm:mb-0 w-full sm:w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                {loading ? 'Loading ...' : 'Update'}
                            </button>
                            {/* Sign out button */}
                            <button type="button" onClick={() => supabase.auth.signOut()} className="w-full sm:w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                Sign Out
                            </button>
                        </div>
                        {/* Subscribe/Cancel button */}
                        <div className="mt-6 w-full">
                            <button
                                type="button"
                                className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5"
                                onClick={handleSubscriptionClick}
                            >
                                {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                </form>
            </>
        )
    );
}
