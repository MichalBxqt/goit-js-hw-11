import Notiflix from 'notiflix';
import axios from 'axios';

const searchEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
let currentPage = 1;
let searchQuery = '';

const apiKey = '41147953-e12c65c5a5e41658f9ab5f6ec';

loadMoreEl.addEventListener('click', () => {
  fetchImages();
});

async function fetchImages() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
        searchQuery
      )}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`
    );
    const images = response.data;
    if (images.hits.length === 0) {
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreEl.computedStyleMap.display = 'none';
      return;
    }

    currentPage += 1;
    renderGallery(images.hits);
    loadMoreEl.style.display = 'block';
    if (currentPage > Math.ceil(images.totalHits / 40)) {
      loadMoreEl.style.display = 'none';
      Notiflix.Report.info(
        'End of Results',
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    Notiflix.Report.failure(
      'Oops!',
      'There was an error fetching images. Please try again later.'
    );
    console.error(err);
  }
}

searchEl.addEventListener('submit', event => {
  event.preventDefault();
  galleryEl.innerHTML = '';
  searchQuery = event.currentTarget.searchQuery.value;
  currentPage = 1;
  fetchImages();
});

function renderGallery(images) {
  const markup = images
    .map(image => {
      return ` 
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${image.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${image.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${image.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${image.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}