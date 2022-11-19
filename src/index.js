import { fetchPictures } from "./js/fetch.js";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import imageHbsFunc from "./hbsTemplates/image.hbs";
import { PER_PAGE } from "./js/params.js";

const formElem = document.querySelector(".search-form");
const galleryElem = document.querySelector(".gallery");
const buttonShowMore = document.querySelector(".load-more");
let page = null;
let query = null;
let totalPages = null;
const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
  navText: ["←", "→"],
});

function handleFormSubmit(event) {
  event.preventDefault();
  buttonShowMore.classList.add("is-hidden");
  page = 1;
  query = event.target.elements.searchQuery.value.trim();
  fetchPictures(query, page).then((pixabayResponse) => {
    Notify.info(`Hooray! We found ${pixabayResponse.totalHits} images`);
    console.log(pixabayResponse);
    galleryElem.innerHTML = "";
    if (pixabayResponse.hits.length === 0) {
      Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      return;
    }
    renderPhotoGallery(pixabayResponse.hits);
    lightbox.refresh();
    totalPages = Math.ceil(pixabayResponse.totalHits / PER_PAGE);
    if (totalPages > 1) buttonShowMore.classList.remove("is-hidden");
  });
}

function renderPhotoGallery(galleryPhotos) {
  const markup = galleryPhotos.map((photo) => imageHbsFunc(photo)).join("");
  galleryElem.insertAdjacentHTML("beforeend", markup);
}

function handleBtnClick() {
  page += 1;
  fetchPictures(query, page).then((pixabayResponse) => {
    renderPhotoGallery(pixabayResponse.hits);
    lightbox.refresh();
    const viewPortHeight = document.documentElement.clientHeight;
    window.scrollBy({
      top: viewPortHeight,
      behavior: "smooth",
    });
    if (page === totalPages) {
      buttonShowMore.classList.add("is-hidden");
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

formElem.addEventListener("submit", handleFormSubmit);
buttonShowMore.addEventListener("click", handleBtnClick);
