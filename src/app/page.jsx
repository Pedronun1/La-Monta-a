'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import ReservationSection from '../components/ReservationSection';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const [info, setInfo] = useState(null);
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [preselectedDishes, setPreselectedDishes] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/info').then((r) => r.json()),
      fetch('/api/menu').then((r) => r.json())
    ])
      .then(([infoData, menuData]) => {
        if (infoData.success) setInfo(infoData);
        if (menuData.success) {
          setMenu({
            categories: menuData.categories || [],
            items: menuData.items || []
          });
        }
      })
      .catch((err) => console.error('Error cargando API:', err));
  }, []);

  const handleToggleDish = (dishName) => {
    setPreselectedDishes((prev) =>
      prev.includes(dishName) ? prev.filter((d) => d !== dishName) : [...prev, dishName]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar preselectedCount={preselectedDishes.length} />
      <main className="flex-1">
        <Hero info={info} />
        <MenuSection
          categories={menu.categories}
          items={menu.items}
          preselectedDishes={preselectedDishes}
          onToggleDish={handleToggleDish}
        />
        <ReservationSection
          info={info}
          preselectedDishes={preselectedDishes}
          onRemoveDish={handleToggleDish}
        />
        <ReviewsSection ratings={info?.ratings} reviews={info?.reviews} />
        <ContactMapSection info={info} />
      </main>
      <Footer info={info} />
    </div>
  );
}
