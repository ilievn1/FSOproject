import { Link } from "react-router-dom";
import { Customer } from "../types";
import { useQueryClient } from "@tanstack/react-query";


const Navbar = () => {
    const queryClient = useQueryClient();
    // UI Component library keeps menu focused all the time, even if clicked
    // handleMenuClick closes upon clicked menu item
    const handleMenuClick = () => {
        const elem = document.activeElement;
        if (elem && elem instanceof HTMLElement) {
            elem.blur();
        }
    };
    const clearCustomerLocalStorage = () => {
        localStorage.removeItem('customerDetails')
    }
    const customer: Customer | undefined = queryClient.getQueryData(['customer'])
    return (
        <div className="drawer">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-base-300">
                    <div className="flex-1">
                        <Link to="/" className="btn btn-ghost normal-case text-xl">Rent-A-Car</Link>
                    </div>
                    {/* Burger icon for sidebar menu size < xs (475px) */}
                    <div className="flex-none xs:hidden">
                        <label htmlFor="mobile-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    {/* Horizontal nav for screen size >= xs (475px) */}
                    <div className="flex-none hidden xs:flex">
                        <ul className="menu menu-horizontal items-center p-0">
                            <li><Link to="/vehicles">Vehicles</Link></li>
                            {!customer
                                ? (<li><a href="http://localhost:3001/api/auth/google">Login</a></li>)
                                :
                                (
                                    <div className="dropdown dropdown-end p-0 relative">
                                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={`${customer?.picture}`} />
                                            </div>
                                        </label>
                                        <ul tabIndex={0} onClick={handleMenuClick} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box">
                                            <li><Link to="/profile">Profile</Link></li>
                                            <li><Link to="/reservations">Reservations</Link></li>
                                            <li><a href="http://localhost:3001/api/auth/google/logout" onClick={clearCustomerLocalStorage}>Logout</a></li>
                                        </ul>
                                    </div>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="drawer-side z-10">
                <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-3/4 h-full bg-base-200">
                    {/* Overlay nav for screen size < xs (475px) */}
                    <li><Link to="/vehicles">Vehicles</Link></li>
                    {!customer
                        ? (<li><a href="http://localhost:3001/api/auth/google">Login</a></li>)
                        :
                        <>
                            <li><Link to="/profile">Profile</Link></li><li><Link to="/reservations">Reservations</Link></li>
                            <li><a href="http://localhost:3001/api/auth/google/logout" onClick={clearCustomerLocalStorage}>Logout</a></li>
                        </>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Navbar