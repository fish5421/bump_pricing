import React from 'react';
import { useState, useEffect } from 'react';
import SubscriptionPage from './SubscriptionPage';
import AccountModal from './AccountModal'; // Import the AccountModal component
import AccountUpdateModal from './AccountUpdateModal';
import { supabase } from './supabaseClient';
import sidephoto from "../src/assets/pexels-rfstudio-3810792.jpg";
import createrPhoto from "../src/assets/Darrel_photo.png";




const LandingPage = ({ session }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);
    const [reloadTimer, setReloadTimer] = useState(false);



    useEffect(() => {
        async function fetchSubscription() {
            const { user } = session;
            if (!user || !user.id) {
                console.log("No user found in session");
                setIsSubscribed(false);
                return;
            }

            const cleanedUserId = user.id.trim();
            console.log('cleanedUserId', cleanedUserId);

            const { data, error } = await supabase
                .from('subscriptions')
                .select('active')
                .eq('subscriber_id', cleanedUserId)
                .eq('active', 'TRUE')
                .maybeSingle();

            if (error) {
                console.error('Error fetching subscription:', error);
                setIsSubscribed(false);
                return;
            }

            if (data && data.active) {
                console.log('data try', data);
                setIsSubscribed(true);
            } else {
                console.log('data catch', data);
                setIsSubscribed(false);
            }
        }

        fetchSubscription();
    }, []);


    const handleSubscriptionClick = async () => {
        if (isSubscribed) {
            console.log('cancel now');
            window.location.href = 'https://billing.stripe.com/p/login/test_28oeVY8Uq6d410c9AA'

        } else {
            console.log('set now');
            setReloadTimer(true); // Toggle the state to trigger re-fetching the subscription status
            console.log('reload timer', reloadTimer);
            setShowSubscriptionPage(true)
        }
    };



    return (
        <>
            <div className="flex flex-col md:flex-row h-full py-12 md:gap-x-10">
                <SubscriptionPage
                    session={session}
                    visible={showSubscriptionPage}
                    onClose={() => setShowSubscriptionPage(false)}
                    reloadTimer={reloadTimer}
                    setReloadTimer={setReloadTimer}
                />
                <AccountModal session={session} />

                {/* Left side with Text and CTA */}
                <div className="flex flex-col justify-between w-full md:w-1/2 p-4 md:p-10 bg-gray-900 text-gray-100 rounded-lg">
                    <div>
                        <div>
                            <img src={createrPhoto} alt="Creator Photo" className="object-cover rounded-lg" />
                        </div>
                        <h1 className="text-5xl font-extrabold mb-4 text-yellow-400">Join Darrel's Inner Circle</h1>
                        <h2 className="text-2xl font-semibold text-white mb-6">Your Launchpad to Startup Success</h2>
                        <p className="text-xl mb-6">Darrel Frater is a seasoned venture capitalist and a three-time founder with a passion for serving others.</p>
                        <ul className="list-disc list-inside mt-4 text-lg space-y-2">
                            <li><strong className="font-extrabold">Personalized Guidance</strong>: Get direct mentorship from Darrel, leverage his startup startup and VC experience, learn the do’s and don’ts, and steer your way towards success.</li>
                            <li><strong className="font-extrabold">Valuable Connections</strong>: Network with a community of like-minded individuals, share experiences, and create opportunities together.</li>
                            <li><strong className="font-extrabold">Latest Industry Trends</strong>: Stay updated with the newest trends and strategies that can set you apart in your industry.</li>
                            <li><strong className="font-extrabold">Investor Insights</strong>: Gain an insider’s view into what investors seek and how investors think so you can leverage that knowledge to your advantage.</li>
                        </ul>
                        <div className="mt-8 text-lg">
                            <strong className="text-xl font-semibold text-yellow-400">Special Bump Subscription Offer & Longevity Discounting</strong>
                            <p className="text-md mt-2">
                                We’re kicking things off with a special subscription offer. The first subscriber gets in at just $10/month, and the price increases by $10 for each new subscriber. Additionally as others exit the community your price gets bumped down, rewarding you for sticking with us.
                            </p>
                            <p className="text-md mt-2">
                                This is a top-tier offering, priced way below the usual $500 monthly fee.
                            </p>
                        </div>
                    </div>
                    <button
                        className="mt-8 text-xl font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-full px-10 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
                        onClick={handleSubscriptionClick}>
                        {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
                    </button>
                    <p className="mt-4 text-lg text-yellow-300">
                        The earlier you subscribe, the less you pay. It's a golden chance to elevate your success with guidance from a veteran, at a price that's affordable for everyone.
                    </p>
                </div>

                {/* Right side with Image */}
                <div className="hidden md:block md:w-1/2 rounded-lg overflow-hidden">
                    <img
                        src={sidephoto}
                        alt="Random"
                        className="h-full w-full object-cover rounded-lg"
                    />
                </div>
            </div>

        </>
    );
};

export default LandingPage;
