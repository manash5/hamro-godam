"use client" 
import { useState, useEffect, Suspense } from 'react'
import Navbar from './components/Landing/Navbar'
import Hero from './components/Landing/Hero'

import Footer from './components/Landing/Footer'
import Loader from './components/Loader'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <Suspense fallback={<Loader />}>
          <Hero />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

