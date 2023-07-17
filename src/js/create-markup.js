import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './load-more-btn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) {
  return `
<div class="photo-card">
<a class="photo-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b> ${downloads}
    </p>
  </div>
</div>
`;
}

function updateList(markup, galleryEl) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

export { createMarkup, updateList };
