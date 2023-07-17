import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38314868-9c5d4de0fbd54f52cde2203d7';

async function getImages(query, page, perPage) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  };
  const { data } = await axios.get(`${BASE_URL}`, { params });

  return data;
}

export { getImages };
