import axios from 'axios'
import React, { useState, useEffect } from 'react'

// process.env.REACT_API_DEBUG
process.env.REACT_APP_DEBUG == 'true' ?
    axios.defaults.baseURL = 'http://127.0.0.1:8000'
    : axios.defaults.baseURL = 'https://lalasol-bootcamp-backend-production.up.railway.app'

const useAxios = ({ method, url, headers = null, data = null }) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    console.log('process.env.REACT_APP_DEBUG: ',)
    const fetchData = async () => {
        try {
            const result = await axios({
                method,
                url,
                headers,
                data,
            })
            // const result = await axios.get('/api/course-category/')
            // console.log('axios: result-', result)
            setResponse(result.data)
        }
        catch (error) {
            // console.log('axois: error--', error)
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return [response, error, loading]
}

export default useAxios