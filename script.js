// YOU LUKA — AUTOMATIC GALLERIES
const galleries={
  ukraine:{path:"images/ukraine/",title:"Ukraine"},
  turkey:{path:"images/turkey/",title:"Turkey"}
};

const allImages={};
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="",currentIndex=0;

function localPath(category,file){
  return galleries[category].path + file;
}

function renderGallery(category,files){
  const gallery=document.getElementById(`${category}-gallery`);
  if(!gallery)return;
  gallery.innerHTML="";
  allImages[category]=files.map(file=>localPath(category,file));

  files.forEach((file,index)=>{
    const img=document.createElement("img");
    img.src=localPath(category,file);
    img.alt=`${galleries[category].title} — Photo ${index+1}`;
    img.loading="lazy";
    img.onclick=()=>openLightbox(category,index);
    img.onerror=()=>img.remove();
    gallery.appendChild(img);
  });
}

async function loadGallery(category){
  const config=galleries[category];
  const gallery=document.getElementById(`${category}-gallery`);

  // First try the GitHub folder directly through the Pages site.
  // This avoids GitHub API/raw URL problems.
  const fallback=[];
  const max=100;

  // Check numbered files without requiring any code change later.
  for(let i=1;i<=max;i++){
    for(const ext of ["jpg","jpeg","png","webp"]){
      const file=`${i}.${ext}`;
      const url=localPath(category,file);
      try{
        const response=await fetch(url,{method:"HEAD",cache:"no-store"});
        if(response.ok){
          fallback.push(file);
          break;
        }
      }catch(e){}
    }
  }

  if(fallback.length){
    renderGallery(category,fallback);
    return;
  }

  // Fallback to GitHub API if HEAD checks are blocked.
  try{
    const response=await fetch(`https://api.github.com/repos/YouLuka/You-Luka/contents/${config.path}?ref=main`,{cache:"no-store"});
    if(!response.ok)throw new Error(response.status);
    const files=await response.json();
    const photos=files
      .filter(f=>f.type==="file" && /^\d+\.(jpe?g|png|webp)$/i.test(f.name))
      .sort((a,b)=>parseInt(a.name)-parseInt(b.name))
      .map(f=>f.name);
    renderGallery(category,photos);
  }catch(e){
    if(gallery)gallery.innerHTML='<p class="gallery-error">Photos could not be loaded. Please check the image filenames.</p>';
    console.error(e);
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