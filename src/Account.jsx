import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import SubscriptionPage from './SubscriptionPage'; // Make sure the path is correct
import { Tooltip } from 'antd';




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
        <>
            <h1 className="text-2xl mb-4 text-center text-black">Darrel's Community</h1>
            {showSubscriptionPage ? (
                <SubscriptionPage session={session} />
            ) : (
                <form onSubmit={updateProfile} className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                            <div className="mb-4 w-full text-black flex items-center">
                            <label htmlFor="email" className="text-lg font-medium text-gray-600 w-1/2">Email</label>
                            <Tooltip title="Your email is required for account identification.">
                                    <span className="cursor-pointer mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" fill="grey">
                                            <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
                                            <path d="M12,5a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V6A1,1,0,0,0,12,5Z" />
                                            <rect x="11" y="17" width="2" height="2" rx="1" />
                                        </svg>
                                    </span>
                            </Tooltip>
                            <input id="email" type="text" value={session.user.email} disabled className="w-1/2 flowbite-input" />
                        </div>
                            <div className="mb-4 w-full text-black flex items-center">
                            <label htmlFor="username" className="text-lg font-medium text-gray-600 w-1/2">Name</label>
                            <Tooltip title="Your name helps us personalize your experience.">
                                    <span className="cursor-pointer mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" fill="grey">
                                            <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
                                            <path d="M12,5a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V6A1,1,0,0,0,12,5Z" />
                                            <rect x="11" y="17" width="2" height="2" rx="1" />
                                        </svg>
                                    </span>
                            </Tooltip>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username || ''}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-1/2 flowbite-input"
                            />
                        </div>
                        <div className="mb-4 w-full text-black flex items-center">
                            <label htmlFor="businessName" className="text-lg font-medium text-gray-600 w-1/2">Business Name (Optional)</label>
                            <Tooltip title="Business name is optional but can help in business-related services.">
                                    <span className="cursor-pointer mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" fill="grey">
                                            <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
                                            <path d="M12,5a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V6A1,1,0,0,0,12,5Z" />
                                            <rect x="11" y="17" width="2" height="2" rx="1" />
                                        </svg>
                                    </span>
                            </Tooltip>
                            <input
                                id="businessName"
                                type="text"
                                value={businessName || ''}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="w-1/2 flowbite-input"
                            />
                        </div>
                        {/* Buttons */}
                        <div className="mb-4 w-full flex flex-col sm:flex-row sm:justify-between gap-9">
                            <button type="submit" disabled={loading} className="mb-2 sm:mb-0 w-full sm:w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                {loading ? 'Loading ...' : 'Update'}
                            </button>
                            <button type="button" onClick={() => supabase.auth.signOut()} className="w-full sm:w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                Sign Out
                            </button>
                        </div>

                        {/* Subscription Button */}
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
            )}
        </>
    );
};
