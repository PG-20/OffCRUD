import {useState, useEffect} from "react";
import {queueLink} from "./index";

export default function useNetwork(){
    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
    useEffect(() => {
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        window.addEventListener('offline', () => queueLink.close());
        window.addEventListener('online', () => queueLink.open());
        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
            window.removeEventListener('offline', () => queueLink.close());
            window.removeEventListener('online', () => queueLink.open());
        };
    });
    return isOnline;
}