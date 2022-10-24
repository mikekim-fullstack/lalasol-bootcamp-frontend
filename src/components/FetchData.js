import axios from 'axios'

const FetchData = async ({ method, url, headers, body, }) => {
    return (async () => {
        console.log('method: ', method)

        try {

            const res = await axios({ method, url, headers, body })
            console.log('res: ', res)
        }
        catch (e) {
            console.log('error: ', e)
        }

    })
}

export default FetchData
