'use client'
import { Pantry } from "../../components/Pantry"
import Navbar from "../../components/Navbar";


export default function Home() {
    return (
        <div style={{backgroundColor: '#F5F5F5'}}>
            <Navbar />
            <Pantry />
        </div>
        
    );
  }