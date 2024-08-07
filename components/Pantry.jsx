/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/fJ56qogPSqm
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { firestore } from "@/firebase/firebase";
import { collection, query, getDocs, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

export function Pantry() {

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      updatePantry()
    }
    
  }, [user])

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    } 
  }, [user, loading, router]);

  const [pantry, setPantry] = useState([])
  const [itemName, setItemName] = useState({
    name: "",
    quantity: 1,
  })

  const updatePantry = async () => {
    const userPantryRef = collection(firestore, `users/${user.uid}/pantry`)
    const querySnapshot = await getDocs(userPantryRef);
    let pantryList = []
    querySnapshot.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    });
    setPantry(pantryList)
  }


  const handleAddItem = async () => {
    let itemExists = false;
    for (let i = 0; i < pantry.length; i++) {
      if (pantry[i].name === itemName.name) {
        itemExists = true;
      }
    }
    
    if (itemExists) {
      setPantry(prevPantry =>
        prevPantry.map(item => 
          item.name == itemName ? {...item, quantity: item.quantity + itemName.quantity} : item
        )
      )
    } else {
      setPantry([
        ...pantry,
        {
          ...itemName,
        },
      ])
    }
    
    
    const docRef = doc(firestore, `users/${user.uid}/pantry`, itemName.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(doc(firestore, `users/${user.uid}/pantry`, itemName.name), { quantity: parseInt(docSnap.data().quantity) + parseInt(itemName.quantity) });
    } else {
      await setDoc(doc(firestore, `users/${user.uid}/pantry`, itemName.name), { quantity: itemName.quantity });
    }

    setItemName({
      name: "",
      quantity: 1,
    })

    updatePantry()
  }

  const deleteItem = async (item) => {
    const docRef = doc(firestore, `users/${user.uid}/pantry`, item);
    await deleteDoc(docRef);
    updatePantry()
  }

  const handleIncrement = async (id) => {
    setPantry(pantry.map(
      (item) => (item.name === id ? { ...item, quantity: parseInt(item.quantity) + 1 } : item)
    ))
    const docRef = doc(firestore, `users/${user.uid}/pantry`, id);
    const docSnap = await getDoc(docRef);

    await setDoc(doc(firestore, `users/${user.uid}/pantry`, id), { quantity: parseInt(docSnap.data().quantity) + 1 });
  }
  const handleDecrement = async (id) => {
    setPantry(pantry.map(
      (item) => (item.name === id ? { ...item, quantity: item.quantity - 1 } : item)
    ))
    const docRef = doc(firestore, `users/${user.uid}/pantry`, id);
    const docSnap = await getDoc(docRef);

    await setDoc(doc(firestore, `users/${user.uid}/pantry`, id), { quantity: docSnap.data().quantity - 1 });
  }

  const [searchTerm, setSearchTerm] = useState("")


  const filteredPantry = searchTerm ? pantry.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : pantry

  if (loading) {
    return <div class="flex justify-center"><h1>Loading...</h1></div>
  }

  if (!user) {
    return null;
  }
  return (
    <>
      
      <div class="grid gap-8 mx-auto px-4 py-8 flex justify-center max-w-7xl">
      <h1 class="text-2xl font-semibold" style={{marginLeft: 25 + '%'}}>Welcome, {user.displayName}</h1>
        <div
          class="rounded-lg border bg-card text-card-foreground shadow-sm w-full"
          data-v0-t="card"
          style={{width: 135 + '%', marginLeft: -17.5 + '%'}}
        >
          <div class="w-full flex flex-col space-y-1.5 p-6">
            <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Add New Item</h3>
            <p class="text-sm text-muted-foreground">Fill out the form to add a new item to your inventory.</p>
          </div>
          <div class="p-6">
            <form class="grid gap-4">
              <div class="grid gap-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="name"
                >
                  Item Name
                </label>
                <input
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="name"
                  placeholder="Enter item name"
                  value={itemName.name}
                  onChange={(e) => setItemName({name:e.target.value, quantity:itemName.quantity})}
                />
              </div>
              <div class="grid gap-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="quantity"
                >
                  Quantity
                </label>
                <input
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="quantity"
                  placeholder="Enter quantity"
                  type="number"
                  value={itemName.quantity}
                  onChange={(e) => setItemName({name: itemName.name, quantity:e.target.value})}
                />
              </div>
            </form>
          </div>
          <div class="flex items-center p-6">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={handleAddItem}>
              Add Item
            </button>
          </div>
        </div>
        <div
          class="rounded-lg border bg-card text-card-foreground shadow-sm md:max-w-[600px] lg:max-w-[800px]"
          data-v0-t="card"
          style={{width: 135 + '%', marginLeft: -17.5 + '%'}}
        >
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Inventory</h3>
            <p class="text-sm text-muted-foreground">View and manage your current inventory items.</p>
          </div>
          <div class="p-4">
            <input
              class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
              placeholder="Search pantry..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div class="p-6 max-h-[400px] overflow-auto">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&amp;_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Item
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Quantity
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  {filteredPantry.map((item) => (
                    <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" key={item.name}>
                      <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                      <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{item.quantity}</td>
                      <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        <div class="flex items-center gap-2">
                          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                          onClick={() => handleDecrement(item.name)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="h-4 w-4"
                            >
                              <path d="M5 12h14"></path>
                            </svg>
                            <span class="sr-only">Decrement</span>
                          </button>
                          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                          onClick={() => handleIncrement(item.name)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="h-4 w-4"
                            >
                              <path d="M5 12h14"></path>
                              <path d="M12 5v14"></path>
                            </svg>
                            <span class="sr-only">Increment</span>
                          </button>
                          <button
                            onClick={() => deleteItem(item.name)}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground hover:text-white h-10 w-10 bg-red-600 text-white"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </>
  );
}

