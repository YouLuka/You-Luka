const galleries = {
    ukraine: {
        total: 40,
        path: "images/ukraine/",
        title: "Ukraine"
    },

    turkey: {
        total: 10,
        path: "images/turkey/",
        title: "Turkey"
    }
};

const allImages = {};

Object.keys(galleries).forEach(category => {
    const gallery = document.getElementById(`${category}-gallery`);
    if (!gallery) return;

    allImages[category] = [];

    for (let i = 1; i <= galleries[category].total; i++) {
        const img = document.createElement("img");

        img.src = `${galleries[category].path}${i}.jpg`;
        img.alt = `${galleries[category].title} — Photo ${i}`;
        img.loading = "lazy";

        const index = allImages[category].length;
        allImages[category].push(img.src);

        img.addEventListener("click", () => {
            openLightbox(category, index);
        });

        gallery.appendChild(img);
    }
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let currentCategory = "";
let currentIndex = 0;

function openLightbox(category, index) {
    currentCategory = category;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("show");
}

function updateLightbox() {
    lightboxImg.src = allImages[currentCategory][currentIndex];
    lightboxImg.alt =
        `${galleries[currentCategory].title} — Photo ${currentIndex + 1}`;
}

document.querySelector(".close").addEventListener("click", () => {
    lightbox.classList.remove("show");
});

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        lightbox.classList.remove("show");
    }
});

document.querySelector(".prev").addEventListener("click", event => {
    event.stopPropagation();

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = allImages[currentCategory].length - 1;
    }

    updateLightbox();
});

document.querySelector(".next").addEventListener("click", event => {
    event.stopPropagation();

    currentIndex++;

    if (currentIndex >= allImages[currentCategory].length) {
        currentIndex = 0;
    }

    updateLightbox();
});

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("show")) return;

    if (event.key === "Escape") {
        lightbox.classList.remove("show");
    }

    if (event.key === "ArrowLeft") {
        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = allImages[currentCategory].length - 1;
        }

        updateLightbox();
    }

    if (event.key === "ArrowRight") {
        currentIndex++;

        if (currentIndex >= allImages[currentCategory].length) {
            currentIndex = 0;
        }

        updateLightbox();
    }
});
