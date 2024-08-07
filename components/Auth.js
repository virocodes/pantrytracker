'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth, googleProvider, firestore } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email, 
        displayName: user.displayName,
      }, { merge: true });
      
      router.push("/pantry");
      console.log('pantry')
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button 
            onClick={handleSignOut} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Track your pantry with ease</h2>
                <button 
                onClick={handleSignIn} 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
                Sign In with Google
                </button>
            </div>
        </div>
        
      )}
    </div>
  );
}
