import axios from "axios";
import { useEffect, useState } from "react";

const Balance = ({ balance }) => {

    return <div className="flex">
        <div className="font-bold text-lg">
            Your Balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs  {balance}
        </div>
    </div>
}

export default Balance;