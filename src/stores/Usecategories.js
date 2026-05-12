// hooks/useCategories.js
// Drop this file into your hooks/ (or utils/) folder.
// Both Home_Screen and AllProduct import from here so they always
// stay in sync with whatever the admin has created in Firestore.

import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

// ─── Static base categories ───────────────────────────────────────────────────
// These are always present, even before Firestore responds.
export const BASE_CATEGORIES = [
  { label: 'All',              value: 'All' },
  { label: 'Snacks',          value: 'Snacks' },
  { label: 'Cigarette',       value: 'Cigarette' },
  { label: 'Juice',           value: 'Juice' },
  { label: 'Daily Essentials',value: 'Daily Essentials' },
  { label: 'Personal Care',   value: 'Personal Care' },
];

// ─── Base category images (used on the Home Screen carousel) ─────────────────
const BASE_CATEGORY_IMAGES = {
  All: 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345894/2305.i309.032.S.m004.c13.paper_bag_vegetables_realistic_composition_pres2s.jpg',
  Cigarette: 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345895/6981_zde0qb.jpg',
  'Daily Essentials': 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345854/top-view-eco-friendly-cleaning-products-with-baking-soda_xdcdj9.jpg',
  'Personal Care': 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345877/decoration-with-soap-oils-bathing_lgzcek.jpg',
  Snacks: 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345895/423197-PE6QPM-300_safcco.jpg',
  Juice: 'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345901/OR7TJT0_lj0mxc.jpg',
};

// Fallback image for any admin-created category that has no image configured
const DEFAULT_CATEGORY_IMAGE =
  'https://res.cloudinary.com/dlazqdrh7/image/upload/v1757345894/2305.i309.032.S.m004.c13.paper_bag_vegetables_realistic_composition_pres2s.jpg';

/**
 * useCategories()
 *
 * Returns:
 *   categoryOptions  – [{ label, value }, ...]  for dropdowns / filter UI
 *   homeCategories   – [{ id, name, image, screen, category }, ...]  for the Home Screen FlatList
 *   loading          – true while the first snapshot arrives
 *
 * The hook subscribes to the Firestore `categories` collection in real-time,
 * so any category the admin creates / deletes appears instantly on every screen.
 */
const useCategories = () => {
  const [adminCategories, setAdminCategories] = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const db  = getFirestore(getApp());
    const ref = collection(db, 'categories');

    // Real-time listener – same collection the admin writes to in
    // AdminProducts.jsx / ProductAddModal.jsx via setDoc(doc(firestore, 'categories', name))
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const names = snapshot.docs
          .map((d) => d.data().name)
          .filter(Boolean);
        setAdminCategories(names);
        setLoading(false);
      },
      (error) => {
        console.warn('useCategories: Firestore error', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ── Merge base + admin, dedup by value ────────────────────────────────────
  const baseValues = new Set(BASE_CATEGORIES.map((c) => c.value));

  const extraCategories = adminCategories
    .filter((name) => !baseValues.has(name))
    .map((name) => ({ label: name, value: name }));

  // Full flat list for dropdowns
  const categoryOptions = [...BASE_CATEGORIES, ...extraCategories];

  // Home screen carousel format
  const homeCategories = categoryOptions.map((cat, idx) => ({
    id:       idx + 1,
    name:     cat.label,
    icon:     '🛒',
    image:    BASE_CATEGORY_IMAGES[cat.value] ?? DEFAULT_CATEGORY_IMAGE,
    itemCount: 0,          // optional: you can fetch counts separately
    screen:   'AllProducts',
    category: cat.value,
  }));

  return { categoryOptions, homeCategories, loading };
};

export default useCategories;