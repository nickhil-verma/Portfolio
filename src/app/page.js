"use client";

import dynamic from 'next/dynamic';

const SinglePage = dynamic(() => import('../components/SinglePage'), { ssr: false });

export default function Home() {
  return <SinglePage />;
}
