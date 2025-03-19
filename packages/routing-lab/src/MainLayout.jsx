import { Header } from "./Header.jsx";
import { Outlet } from "react-router";

export function MainLayout({ handleLogout }) {
    return (
        <div>
            <Header />
            <button onClick={handleLogout} style={{ margin: "1em" }}>Logout</button>
            <div style={{ padding: "0 2em" }}>
                <Outlet />
            </div>
        </div>
    );
}
