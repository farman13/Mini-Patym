import { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import axios from 'axios';

const Dashboard = () => {

    const [user, setUser] = useState();

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response =>
                setUser(response.data)
            )
    }, [])

    if (!user) {
        return <div>Loading...</div>
    }

    return <div>
        <AppBar name={user.firstName} />
        <div className="m-8">
            <Balance balance={user.balance} />
            <Users />
        </div>
    </div>
}

export default Dashboard;