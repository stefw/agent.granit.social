'use client';

import React from 'react';

interface BookmarkletButtonProps {
  bookmarkletCode: string;
  siteName: string;
}

export default function BookmarkletButton({ bookmarkletCode, siteName }: BookmarkletButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert(`Glissez ce bouton dans votre barre de favoris pour l'installer.`);
  };

  return (
    <a 
      href={bookmarkletCode}
      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
      onClick={handleClick}
      draggable="true"
    >
      Ajouter à {siteName}
    </a>
  );
}
