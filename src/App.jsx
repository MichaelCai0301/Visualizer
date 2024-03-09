import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Home, Statistics, Algorithms, Tortoise, Dijkstra} from './pages';
const App = () => {
  return (
    <main>
      <Router>
        <Routes>
             <Route path="/" element={<Home/>}/>
             <Route path="/statistics" element={<Statistics/>}/>
             <Route path="/algorithms" element={<Algorithms/>}/>
             <Route path="/tortoise-and-hare" element={<Tortoise/>}/>
             <Route path="/dijkstra" element={<Dijkstra/>}/>
           </Routes>
      </Router>
    </main>
  )
}

export default App