import { useState } from 'react'
import { supabase } from './supabaseClient'
import logo from '../src/assets/logo.png';
import { message, notification } from 'antd';



export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            notification['error']({
                message: 'Login Failed',
                description: error.error_description || error.message,
                duration: 4,
            });
        } else {
            message.success('Check your email for the login link!', 4);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-row min-h-screen w-screen">
            <div className="flex-1 flex flex-col items-center justify-center bg-red-700 pb-40">
                <img src={logo} alt="Community Logo" className="w-144 h-144" />
                <div className="-mt-12 text-white text-center">
                    <h2 className="text-2xl font-semibold">Join Darrel's Inner Circle: Your Launchpad to Startup Success</h2>
                    <p className="mt-2 text-lg">Darrel Frater is a seasoned venture capitalist and a three-time founder with a passion for serving others. Kickstart your journey in Darrel's Inner Circle, a paid community dedicated to equipping ambitious leaders like yourself to success.</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-black">
                <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl   p-4 sm:p-6 md:p-8 lg:p-10 space-y-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100">
                        Sign in to your account
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-100">
                                Your email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="w-full h-12 px-2 py-1 border-0 rounded-full bg-gray-800 text-gray-400 text-lg focus:outline-none focus:ring-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full h-14 px-2 py-1 border-0 rounded-full bg-white text-black text-lg font-medium focus:outline-none focus:ring-0"
                                disabled={loading}
                            >
                                {loading ? 'Loading' : 'Send magic link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
