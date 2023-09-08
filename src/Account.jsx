import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import SubscriptionPage from './SubscriptionPage'; // Make sure the path is correct
import StepWizard from 'react-step-wizard';  // Assuming you've added this package for step-by-step flow




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
                <header className="bg-blue-500 text-white text-center py-4">
                    Darrel's Community
                </header>
                <form onSubmit={updateProfile} className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                        {/* Email */}
                        <div className="mb-4 w-full text-black">
                            <label htmlFor="email" className="text-lg font-medium text-gray-600">
                                Email <Tooltip title="We need your email to send you updates and account-related information.">❗️</Tooltip>
                            </label>
                            <input id="email" type="text" value={session.user.email} disabled className="w-full flowbite-input" />
                        </div>
                        {/* Username */}
                        <div className="mb-4 w-full text-black">
                            <label htmlFor="username" className="text-lg font-medium text-gray-600">
                                Name <Tooltip title="Your name helps personalize your experience.">❗️</Tooltip>
                            </label>
                            <input id="username" type="text" required value={username || ''} onChange={(e) => setUsername(e.target.value)} className="w-full flowbite-input" />
                        </div>
                        {/* Business Name */}
                        <div className="mb-4 w-full text-black">
                            <label htmlFor="businessName" className="text-lg font-medium text-gray-600">
                                Business Name <Tooltip title="Optional. Add your business name for business-related services.">❗️</Tooltip>
                            </label>
                            <input id="businessName" type="text" value={businessName || ''} onChange={(e) => setBusinessName(e.target.value)} className="w-full flowbite-input" />
                        </div>
                        {/* Action buttons */}
                        <div className="mb-4 w-full flex flex-col sm:flex-row sm:justify-between gap-9">
                            <button type="submit" disabled={loading} className="mb-2 sm:mb-0 w-full sm:w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                {loading ? 'Loading ...' : 'Update'}
                            </button>
                            <button type="button" onClick={() => supabase.auth.signOut()} className="w-full sm:w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
                                Sign Out
                            </button>
                        </div>
                        <div className="mt-6 w-full">
                            <button type="button" className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5" onClick={handleSubscriptionClick}>
                                {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                </form>
            </>
        )
    );
};
