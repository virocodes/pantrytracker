import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user] = useAuthState(auth);
    const router = useRouter()
  
    const handleSignOut = async () => {
          try {
              await signOut(auth)
              router.push("/")
          } catch (error) {
              console.log(error);
          }
      }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Pantry Tracker
        </div>
        {user && 
        <button
          onClick={handleSignOut}
          className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button> }
      </div>
    </nav>
  );
}