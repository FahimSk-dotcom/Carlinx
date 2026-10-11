import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GeminiChat from '@/Components/GeminiChat';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <GeminiChat />
    </>
  );
};

export default Layout;

