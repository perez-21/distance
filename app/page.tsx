"use client"

import { useState, useEffect } from 'react';
import { MapPin, Users, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  distance: number;
  lat: number;
  lng: number;
}

interface StoredUser {
  id: string;
  name: string;
}

// Mock API functions
const mockPostUser = async (name: string, lat: number, lng: number): Promise<{ success: boolean; id: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    id: `user_${Math.random().toString(36).substr(2, 9)}`
  };
};

const mockGetNearbyUsers = async (lat: number, lng: number): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const names = ['Alex Chen', 'Jordan Smith', 'Sam Rivera', 'Casey Morgan', 'Taylor Kim', 'Robin Park', 'Drew Martinez', 'Morgan Lee'];
  
  return names.map((name, i) => ({
    id: `user_${i}`,
    name,
    distance: Math.random() * 5 + 0.1,
    lat: lat + (Math.random() - 0.5) * 0.05,
    lng: lng + (Math.random() - 0.5) * 0.05
  })).sort((a, b) => a.distance - b.distance);
};

export default function LocationLeaderboard() {
  const [step, setStep] = useState<'input' | 'loading' | 'leaderboard'>('input');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Check for stored user
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored) as StoredUser;
      setCurrentUser(user);
      setName(user.name);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setError('');
    setStep('loading');

    try {
      // Get user's location
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation({ lat, lng });

      // POST user data
      const postResponse = await mockPostUser(name.trim(), lat, lng);

      if (postResponse.success) {
        // Store user data
        const userData: StoredUser = {
          id: postResponse.id,
          name: name.trim()
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);

        // GET nearby users
        const nearbyUsers = await mockGetNearbyUsers(lat, lng);
        setUsers(nearbyUsers);
        setStep('leaderboard');
      }
    } catch (err) {
      setError('Failed to get location or connect to server. Please try again.');
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {step === 'input' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-indigo-100 p-4 rounded-2xl">
                <MapPin className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-3">
              Find People Nearby
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Connect with others in your area
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg shadow-indigo-200"
              >
                Find Nearby People
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              We'll request your location to show people nearby
            </p>
          </div>
        )}

        {step === 'loading' && (
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Finding People Nearby
            </h2>
            <p className="text-gray-600">
              Getting your location and searching...
            </p>
          </div>
        )}

        {step === 'leaderboard' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                People Near You
              </h2>
              <p className="text-indigo-100 text-center">
                Sorted by distance from your location
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-3">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {user.distance.toFixed(2)} km away
                        </p>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {currentUser && (
                <div className="mt-8 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                  <p className="text-sm text-indigo-900 text-center">
                    <span className="font-semibold">Logged in as:</span> {currentUser.name}
                  </p>
                  <p className="text-xs text-indigo-700 text-center mt-1">
                    ID: {currentUser.id}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}