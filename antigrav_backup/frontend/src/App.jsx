import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Assessment from './pages/Assessment';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/home" element={<Home />} />
                <Route path="/assessment" element={<Assessment />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
