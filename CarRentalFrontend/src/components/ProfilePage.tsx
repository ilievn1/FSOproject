import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";

const ProfilePage = () => {
    const {pathname} = useLocation();

    return (
        <>
            <Breadcrumbs currentRoute={pathname} />
            <div className="flex flex-col items-center">
                <div className="avatar">
                    <div className="w-24 mask mask-squircle">
                        <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div className="basis-2/3">
                    <form onSubmit={() => { }}>
                        <h1 className="text-2xl font-semibold mb-4">Change user information</h1>
                        <div className="mb-4 form-control w-full">
                            <label className="block text-sm font-medium mb-1">New username</label>
                            <input type="text" className="input input-bordered w-full" />
                        </div>
                        <div className="mb-4 form-control w-full">
                            <label className="block text-sm font-medium mb-1">New password</label>
                            <input type="password" className="input input-bordered w-full" />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">Submit</button>
                    </form>
                </div>
            </div></>
    )
}

export default ProfilePage