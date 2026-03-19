
const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {
    return <header className="app-header">
        <Link to="/" className="logo-text">
            <span >
                <span style={{color:'#4285F4'}}>G</span>
                <span style={{color:'#EA4335'}}>o</span>
                <span style={{color:'#FBBC05'}}>o</span>
                <span style={{color:'#4285F4'}}>g</span>
                <span style={{color:'#34A853'}}>l</span>
                <span style={{color:'#EA4335'}}>e</span>
                <span style={{color:'#4285F4'}}> </span>
                <span style={{color:'#EA4335'}}>A</span>
                <span style={{color:'#FBBC05'}}>p</span>
                <span style={{color:'#4285F4'}}>p</span>
                <span style={{color:'#34A853'}}>s</span>
                <span style={{color:'#EA4335'}}>u</span>
                <span style={{color:'#FBBC05'}}>s</span>
            </span>
        </Link>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">Mail</NavLink>
            <NavLink to="/note">Note</NavLink>
        </nav>
    </header>
}

