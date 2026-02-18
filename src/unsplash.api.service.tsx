import axios from 'axios';

const getUrl = 'https://api.unsplash.com/search/photos';
// const options = {
//     headers: {
//         Authorization: 'Client-ID bNkPwaT860INeJzPCkZhbNdv5Ucsh4Ef0A4TSCJ7EBs'
//     },
//     params: {
//         query: 'cars'
//     }
// }
const searchImages = async (searchTerm: any) => {
    const response = await axios.get(getUrl, {
        headers: {
            Authorization: 'Client-ID bNkPwaT860INeJzPCkZhbNdv5Ucsh4Ef0A4TSCJ7EBs'
        },
        params: {
            query: searchTerm
        }
    })
    console.log(response.data.results)
    return response.data.results;
}

export default searchImages;