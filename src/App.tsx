import './App.css';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Homepage from './pages/Homepage';

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Homepage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
