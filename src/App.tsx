import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PokemonProvider } from './contexts/PokemonContext';
import ListView from './components/ListView.module';
import GalleryView from './components/GalleryView.module';
import DetailView from './components/DetailView.module';
import Navigation from './components/Navigation.module';
import './App.css';

function App() {
  return (
    <PokemonProvider>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:id" element={<DetailView />} />
          </Routes>
        </main>
      </div>
    </PokemonProvider>
  );
}

export default App;