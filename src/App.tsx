import { Routes, Route } from 'react-router-dom';
import Playground from './playground/UiKit';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dev" element={<Playground />} />
    </Routes>
  );
}

export default App;
