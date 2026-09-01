// YOU LUKA — AUTOMATIC GALLERIES
// Current photos are also used as a fallback if GitHub API is temporarily unavailable.
// Add numbered JPG/JPEG/PNG/WEBP files to a country folder later.

const owner="YouLuka";
const repository="You-Luka";
const branch="main";

const galleries={
  ukraine:{
    path:"images/ukraine/",
    title:"Ukraine",
    fallback:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg","29.jpg","30.jpg","31.jpg","32.jpg","33.jpg","34.jpg","36.png"]
  },
  turkey:{
    path:"images/turkey/",
    title:"Turkey",
    fallback:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg"]
  }
};

const allImages={};
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="",currentIndex=0;

function rawUrl(category,file){
  return `https://raw.githubusercontent.com/${owner}/${repository}/${branch}/${galleries[category].path}${encodeURIComponent(file).replace(/%2F/g,"/")}`;
}

function renderGallery(category,files){
  const gallery=document.getElementById(`${category}-gallery`);
  if(!gallery)return;
  gallery.innerHTML="";
  allImages[category]=files.map(file=>rawUrl(category,file));

  files.forEach((file,index)=>{
    const img=document.createElement("img");
    img.src=rawUrl(category,file);
    img.alt=`${galleries[category].title} — Photo ${index+1}`;
    img.loading="lazy";
    img.onerror=()=>img.remove();
    img.onclick=()=>openLightbox(category,index);
    gallery.appendChild(img);
  });
}

async function loadGallery(category){
  const config=galleries[category];

  // Show the known photos immediately.
  renderGallery(category,config.fallback);

  // Then ask GitHub for the current folder contents.
  try{
    const url=`https://api.github.com/repos/${owner}/${repository}/contents/${config.path}?ref=${branch}`;
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok)throw new Error(`GitHub API ${response.status}`);
    const files=await response.json();

    const photos=files
      .filter(file=>file.type==="file" && /^\d+\.(jpe?g|png|webp)$/i.test(file.name))
      .sort((a,b)=>parseInt(a.name)-parseInt(b.name))
      .map(file=>file.name);

    if(photos.length)renderGallery(category,photos);
  }catch(error){
    console.warn(`Automatic update unavailable for ${config.title}; using current photos.`,error);
  }
}

Object.keys(galleries).forEach(loadGallery);

function openLightbox(category,index){
  if(!allImages[category]?.[index])return;
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