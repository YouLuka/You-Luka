// YOU LUKA — SIMPLE & RELIABLE GALLERIES
// No GitHub API is used. Photos are loaded directly from your folders.

const galleries = {
  ukraine: {
    path: "images/ukraine/",
    title: "Ukraine",
    photos: [
      "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg",
      "10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg",
      "18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg",
      "26.jpg","27.jpg","28.jpg","29.jpg","30.jpg","31.jpg","32.jpg","33.jpg",
      "34.jpg","36.png"
    ]
  },

  turkey: {
    path: "images/turkey/",
    title: "Turkey",
    photos: [
      "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg"
    ]
  }
};

const allImages = {};
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
let currentCategory = "";
let currentIndex = 0;

function renderGallery(category) {
  const config = galleries[category];
  const gallery = document.getElementById(`${category}-gallery`);
  if (!gallery) return;

  allImages[category] = [];

  config.photos.forEach((file) => {
    const url = config.path + file;
    allImages[category].push(url);

    const img = document.createElement("img");
    img.src = url;
    img.alt = `${config.title} — ${file}`;
    img.loading = "lazy";

    img.addEventListener("click", () => {
      const index = allImages[category].indexOf(url);
      openLightbox(category, index);
    });

    // Hide only a genuinely missing file; the rest continue loading.
    img.addEventListener("error", () => {
      img.style.display = "none";
    });

    gallery.appendChild(img);
  });
}

renderGallery("ukraine");
renderGallery("turkey");

function openLightbox(category, index) {
  if (!allImages[category] || !allImages[category].length) return;

  currentCategory = category;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  lightboxImg.src = allImages[currentCategory][currentIndex];
  lightboxImg.alt =
    `${galleries[currentCategory].title} — Photo ${currentIndex + 1}`;
}

function closeLightbox() {
  lightbox.classList.remove("show");
  document.body.style.overflow = "";
}

document.querySelector(".close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.querySelector(".prev").addEventListener("click", (event) => {
  event.stopPropagation();
  const photos = allImages[currentCategory];
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateLightbox();
});

document.querySelector(".next").addEventListener("click", (event) => {
  event.stopPropagation();
  const photos = allImages[currentCategory];
  currentIndex = (currentIndex + 1) % photos.length;
  updateLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();

  if (event.key === "ArrowLeft") {
    document.querySelector(".prev").click();
  }

  if (event.key === "ArrowRight") {
    document.querySelector(".next").click();
  }
});
