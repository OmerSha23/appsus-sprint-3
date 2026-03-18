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
