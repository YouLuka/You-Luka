// YOU LUKA — AUTOMATIC GALLERIES
// Add numbered JPG/JPEG/PNG/WEBP files to the country folders.
// No number needs to be changed here.

const owner="YouLuka";
const repository="You-Luka";
const branch="main";

const galleries={
  ukraine:{path:"images/ukraine/",title:"Ukraine"},
  turkey:{path:"images/turkey/",title:"Turkey"}
};

const allImages={};
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="",currentIndex=0;

async function loadGallery(category){
  const gallery=document.getElementById(`${category}-gallery`);
  if(!gallery)return;
  const config=galleries[category];
  allImages[category]=[];
  const url=`https://api.github.com/repos/${owner}/${repository}/contents/${config.path}?ref=${branch}`;

  try{
    const response=await fetch(url);
    if(!response.ok)throw new Error("GitHub API error");
    const files=await response.json();
    const photos=files
      .filter(file=>file.type==="file" && /^\d+\.(jpe?g|png|webp)$/i.test(file.name))
      .sort((a,b)=>parseInt(a.name)-parseInt(b.name));

    photos.forEach((file,index)=>{
      const img=document.createElement("img");
      img.src=file.download_url;
      img.alt=`${config.title} — Photo ${index+1}`;
      img.loading="lazy";
      allImages[category].push(file.download_url);
      img.onclick=()=>openLightbox(category,index);
      gallery.appendChild(img);
    });
  }catch(error){console.error(`Could not load ${config.title}:`,error)}
}

Object.keys(galleries).forEach(loadGallery);

function openLightbox(category,index){
  if(!allImages[category]?.length)return;
  currentCategory=category;
  currentIndex=index;
  updateLightbox();
  lightbox.classList.add("show");
}
function updateLightbox(){
  lightboxImg.src=allImages[currentCategory][currentIndex];
  lightboxImg.alt=`${galleries[currentCategory].title} — Photo ${currentIndex+1}`;
}
function closeLightbox(){lightbox.classList.remove("show")}
document.querySelector(".close").onclick=closeLightbox;
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()};
document.querySelector(".prev").onclick=e=>{
  e.stopPropagation();
  currentIndex=(currentIndex-1+allImages[currentCategory].length)%allImages[currentCategory].length;
  updateLightbox();
};
document.querySelector(".next").onclick=e=>{
  e.stopPropagation();
  currentIndex=(currentIndex+1)%allImages[currentCategory].length;
  updateLightbox();
};
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("show"))return;
  if(e.key==="Escape")closeLightbox();
  if(e.key==="ArrowLeft")document.querySelector(".prev").click();
  if(e.key==="ArrowRight")document.querySelector(".next").click();
});