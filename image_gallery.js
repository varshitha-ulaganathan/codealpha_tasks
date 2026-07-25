const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-nav.prev');
const nextButton = document.querySelector('.lightbox-nav.next');

let activeFilter = 'all';
let activeIndex = 0;
let filteredItems = [];

function getVisibleItems() {
  return galleryItems.filter((item) => item.classList.contains(activeFilter) || activeFilter === 'all');
}

function updateGallery() {
  filteredItems = getVisibleItems();

  galleryItems.forEach((item) => {
    const isVisible = activeFilter === 'all' || item.dataset.category === activeFilter;
    item.classList.toggle('is-hidden', !isVisible);
  });

  if (filteredItems.length) {
    activeIndex = Math.min(activeIndex, filteredItems.length - 1);
  }
}

function filterSelection(filter) {
  activeFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  updateGallery();
}

function openLightbox(index) {
  if (!filteredItems.length) return;

  const visibleIndex = filteredItems.findIndex((item) => Number(item.dataset.index) === index);
  if (visibleIndex === -1) {
    activeIndex = 0;
  } else {
    activeIndex = visibleIndex;
  }

  showCurrentImage();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
}

function showCurrentImage() {
  const currentItem = filteredItems[activeIndex];
  if (!currentItem) return;

  const image = currentItem.querySelector('img');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
}

function changeImage(step) {
  if (!filteredItems.length) return;
  activeIndex = (activeIndex + step + filteredItems.length) % filteredItems.length;
  showCurrentImage();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterSelection(button.dataset.filter));
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const index = Number(item.dataset.index);
    openLightbox(index);
  });
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => changeImage(-1));
nextButton.addEventListener('click', () => changeImage(1));

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('active')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') changeImage(1);
  if (event.key === 'ArrowLeft') changeImage(-1);
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

updateGallery();
