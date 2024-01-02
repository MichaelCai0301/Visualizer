import { NavLink } from 'react-router-dom'
//  delete this???????
const Navbar = () => {
  return (
    <header>
        <NavLink to="/">
            <p>Home</p>
        </NavLink>
        <nav>
            <NavLink to="/statistics"> {/* See 21:50 in https://www.youtube.com/watch?v=FkowOdMjvYo&ab_channel=JavaScriptMastery to see how u can stylize this in a really cool way*/}
                stats
            </NavLink>
        </nav>
    </header>
  )
}

export default Navbar