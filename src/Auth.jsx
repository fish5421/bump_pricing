import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-gray-900">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 space-y-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    Sign in to your account
                </h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-900">
                            Your email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            className="w-full p-2 sm:p-3 md:p-4 lg:p-5 border rounded-lg focus:ring-primary-600 focus:border-primary-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5 font-medium text-white" disabled={loading}>
                            {loading ? 'Loading' : 'Send magic link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
