export default function useApi(){
    const APIURL = "http://localhost:5000/"
    async function apiRequest(endpoint: string, ){
        try {
            await fetch(APIURL, {
                method: "post",
            })
        } catch (error) {
            
        }
    }
}