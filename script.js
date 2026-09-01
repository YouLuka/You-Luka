const galleries={
ukraine:{total:34,path:"images/ukraine/",title:"Ukraine"},
turkey:{total:9,path:"images/turkey/",title:"Turkey"}
};

const allImages={ukraine:[],turkey:[]};
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="",currentIndex=0;

function addImage(category,i){
const gallery=document.getElementById(category+"-gallery");
const src=galleries[category].path+i+".jpg";
const img=document.createElement("img");
img.src=src;
img.alt=galleries[category].title+" — Photo "+i;
img.loading="lazy";
const index=allImages[category].length;
allImages[category].push(src);
img.onclick=()=>openLightbox(category,index);
img.onerror=()=>{img.remove();allImages[category]=allImages[category].filter(x=>x!==src)};
gallery.appendChild(img);
}

Object.keys(galleries).forEach(category=>{
for(let i=1;i<=galleries[category].total;i++)addImage(category,i);
});

function openLightbox(category,index){
if(!allImages[category][index])return;
currentCategory=category;
currentIndex=index;
updateLightbox();
lightbox.classList.add("show");
document.body.style.overflow="hidden";
}
function updateLightbox(){
lightboxImg.src=allImages[currentCategory][currentIndex];
lightboxImg.alt=galleries[currentCategory].title+" — Photo "+(currentIndex+1);
}
function closeLightbox(){
lightbox.classList.remove("show");
document.body.style.overflow="";
}
document.querySelector(".close").onclick=closeLightbox;
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()};
document.querySelector(".prev").onclick=e=>{
e.stopPropagation();
const n=allImages[currentCategory].length;
if(!n)return;
currentIndex=(currentIndex-1+n)%n;
updateLightbox();
};
document.querySelector(".next").onclick=e=>{
e.stopPropagation();
const n=allImages[currentCategory].length;
if(!n)return;
currentIndex=(currentIndex+1)%n;
updateLightbox();
};
document.addEventListener("keydown",e=>{
if(!lightbox.classList.contains("show"))return;
if(e.key==="Escape")closeLightbox();
if(e.key==="ArrowLeft")document.querySelector(".prev").click();
if(e.key==="ArrowRight")document.querySelector(".next").click();
});
document.getElementById("top").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});

const hero=document.getElementById("hero-image");
if(hero){
const candidates=["images/hero.jpg","images/ukraine/hero.jpg","images/ukraine/cover.jpg","images/cover.jpg"];
let n=0;
hero.onerror=()=>{
n++;
if(n<candidates.length)hero.src=candidates[n];
};
}