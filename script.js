// YOU LUKA — AUTOMATIC GALLERIES
// Add numbered JPG files to the folders. No number needs changing here.

const owner = "youluka";
const repository = "You";
const branch = "main";

const galleries = {
    ukraine: { path: "images/ukraine/", title: "Ukraine" },
    turkey: { path: "images/turkey/", title: "Turkey" }
};

const allImages = {};

async function loadGallery(category) {
    const gallery = document.getElementById(`${category}-gallery`);
    if (!gallery) return;
    const config = galleries[category];
    allImages[category] = [];

    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/contents/${config.path}?ref=${branch}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("GitHub API error");
        const files = await response.json();

        const photos = files
            .filter(file => file.type === "file" && /^\d+\.jpg$/i.test(file.name))
            .sort((a,b) => parseInt(a.name) - parseInt(b.name));

        photos.forEach((file,index) => {
            const img = document.createElement("img");
            img.src = file.download_url;
            img.alt = `${config.title} — Photo ${index + 1}`;
            img.loading = "lazy";
            allImages[category].push(file.download_url);
            img.addEventListener("click", () => openLightbox(category,index));
            gallery.appendChild(img);
        });
    } catch(error) {
        console.error(`Could not load ${config.title} gallery:`,error);
    }
}

Object.keys(galleries).forEach(loadGallery);

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="", currentIndex=0;

function openLightbox(category,index){currentCategory=category;currentIndex=index;updateLightbox();lightbox.classList.add("show")}
function updateLightbox(){lightboxImg.src=allImages[currentCategory][currentIndex];lightboxImg.alt=`${galleries[currentCategory].title} — Photo ${currentIndex+1}`}
document.querySelector(".close").onclick=()=>lightbox.classList.remove("show");
lightbox.onclick=e=>{if(e.target===lightbox)lightbox.classList.remove("show")};
document.querySelector(".prev").onclick=e=>{e.stopPropagation();currentIndex=(currentIndex-1+allImages[currentCategory].length)%allImages[currentCategory].length;updateLightbox()};
document.querySelector(".next").onclick=e=>{e.stopPropagation();currentIndex=(currentIndex+1)%allImages[currentCategory].length;updateLightbox()};
document.addEventListener("keydown",e=>{
    if(!lightbox.classList.contains("show"))return;
    if(e.key==="Escape")lightbox.classList.remove("show");
    if(e.key==="ArrowLeft"){currentIndex=(currentIndex-1+allImages[currentCategory].length)%allImages[currentCategory].length;updateLightbox()}
    if(e.key==="ArrowRight"){currentIndex=(currentIndex+1)%allImages[currentCategory].length;updateLightbox()}
});