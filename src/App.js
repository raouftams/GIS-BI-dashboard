import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/Main';
import Town from './pages/Town';
import Unity from './pages/Unity';
import Statistics from './pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Main/>}/>
        <Route path="/dashboard/town/:code" element={<Town/>}/>
        <Route path="/dashboard/unity/:code" element={<Unity/>}/>
        <Route path="/stats/:type/:dataType/:year/:month" element={<Statistics/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
