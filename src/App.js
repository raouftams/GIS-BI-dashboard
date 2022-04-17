import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/Main';
import Town from './pages/Town';
import Unity from './pages/Unity';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Main/>}/>
        <Route path="/dashboard/town/:code" element={<Town/>}/>
        <Route path="/dashboard/unity/:code" element={<Unity/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
