import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup, updateList } from './js/create-markup';
import { getImages } from './js/get-images';

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const toTopBtn = document.querySelector('.btn-to-top');

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);
window.addEventListener('scroll', debounce(onScroll, 10));
toTopBtn.addEventListener('click', onToTopBtn);

onScroll();
onToTopBtn();

async function onSearchForm(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  galleryEl.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }
  try {
    const data = await getImages(query, page, perPage);
    if (data.totalHits === 0) {
      displayNoResultsAlert();
    } else {
      data.hits.forEach(element => {
        updateList(createMarkup(element), galleryEl);
      });
      simpleLightBox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
      alertImagesFound(data);
      if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchForm.reset();
  }
}

async function onLoadMoreBtn() {
  page += 1;
  try {
    const data = await getImages(query, page, perPage);

    data.hits.forEach(element => {
      updateList(createMarkup(element), galleryEl);
    });
    simpleLightBox.refresh();

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      await delay(500);
      alertEndOfSearch();
    }
  } catch (error) {
    console.log(error);
  }
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure(
    'The search bar cannot be empty. Please type any criteria in the search bar.'
  );
}

function displayNoResultsAlert() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(callback, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
}

function onScroll() {
  const scrolled = window.pageYOffset;
  const comply = document.documentElement.clientHeight;
  const isScrolled = scrolled > comply;

  toTopBtn.classList.toggle('btn-to-top--visible', isScrolled);
}

function onToTopBtn() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
onScroll();
onToTopBtn();
