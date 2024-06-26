import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Home, Statistics, Algorithms, Tortoise, Dijkstra, Bfs, Dfs, Quicksort,
        LLN, CLT} from './pages';
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
             <Route path="/bfs" element={<Bfs/>}/>
             <Route path="/dfs" element={<Dfs/>}/>
             <Route path="/quicksort" element={<Quicksort/>}/>
             <Route path="/lln" element={<LLN/>}/>
             <Route path="/clt" element={<CLT/>}/>
           </Routes>
      </Router>
    </main>
  )
}

export default App