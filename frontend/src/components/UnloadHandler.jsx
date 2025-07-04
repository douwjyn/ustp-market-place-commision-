import { useEffect } from 'react';
import axios from 'axios'
import { api } from '../lib/axios';

export default function unloadHandler() {

    async function handleUnload() {
        /*
            Handle your logout logic here...POST request or whatever
        */
        await api.post('/user/status', {
            status: 'offline'
        })

        window.close();
    }
    useEffect(() => {
        handleUnload();
    }, []);
    return null;
}