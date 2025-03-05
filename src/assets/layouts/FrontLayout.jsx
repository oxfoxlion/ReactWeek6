import { NavLink, Outlet } from "react-router-dom";

const routes = [
    {
        path: '/',
        name: "首頁"
    }, {
        path: '/products',
        name: "產品列表"
    }, {
        path: '/carts',
        name: "購物車"
    }
]

export default function FrontLayout() {
    return (
        <>
            <nav className="navbar bg-body-tertiary" >
                <div className="container">
                    <ul className="navbar-nav flex-row gap-5 fs-5">
                        {routes.map((route) => (
                            <li className="nav-item" key={route.name}>
                                <NavLink className="nav-link" to={route.path}>{route.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <Outlet></Outlet>
        </>


    )
}