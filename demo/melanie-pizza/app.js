const menu={
  pizza:[
    {title:"Klassiker",note:"120–135 kr",items:[
      ["Margherita","Tomatsås, ost",120],["Vesuvio","Skinka",135],["Capricciosa","Skinka, champinjoner",135],
      ["Hawaii","Skinka, ananas",135],["Pepperoni","Pepperoni, tomat, basilika",135],["Vegetariana","Grönsaker, oliver",135]
    ]},
    {title:"Mozzarella",note:"145 kr",items:[
      ["Huset","Soltorkade tomater, champinjoner, ananas, oliver, ruccola",145],["Crudo","Parmaskinka, ruccola",145],
      ["Formaggi","Olika italienska ostar, gorgonzola",145],["Ortolana","Champinjoner, tomat, paprika, oliver, aubergine, zucchini, vitlök",145]
    ]},
    {title:"Special & mexikanskt",note:"145–155 kr",items:[
      ["Kycklingpizza","Kyckling, ananas, banan, curry",145],["Kebabpizza","Kebab, sallad, tomat, lök, feferoni, kebabsås",145],
      ["Gyrospizza","Gyros, paprika, lök, gyrossås",145],["Dolce","Fläskfilé, champinjoner, lök, ruccola, bearnaise",150],
      ["Oxfilé","Oxfilé, champinjoner, tomat, bearnaisesås",155],["Azteka","Skinka, jalapeños, tacosås, tacokrydda, gräddfil",155],
      ["Mexicana","Köttfärs, lök, jalapeño, tacosås, tacokrydda, vitlök",155],["U-Båt","Halvinbakad, oxfilé, paprika, tomat, gorgonzola, bearnaisesås",155]
    ]}
  ],
  ovrigt:[
    {title:"Kebab, kyckling, gyros & falafel",note:"Utvalda rätter",items:[
      ["I hembakat bröd","Sallad, tomat, lök, feferoni, sås och dryck",125],["Rulle","Kebab, kyckling, gyros eller falafel",125],
      ["Tallrik med pommes eller ris","Kebab, kyckling, gyros eller falafel",159]
    ]},
    {title:"Mer från köket",note:"110–145 kr",items:[
      ["90 g hamburgare","Burgare med bröd och tillbehör",110],["Stor / kycklingmeny","Burgare, pommes och dryck",145],
      ["Fräsch sallad","Välj bland bland annat kyckling, kebab, halloumi eller grekisk sallad",135]
    ]}
  ],
  tillval:[{title:"Tillval",note:"10–25 kr",items:[
    ["Extra pålägg","Välj bland kött, ost, grönsaker eller dubbeldeg",25],["Glutenfri deg","",20],
    ["Veganost","",20],["Extra sås","Mild, stark, vitlök, bearnaise, Rhode Island, curry eller vinäger",10]
  ]}]
};

const menuContent=document.querySelector("#menu-content");
const filters=[...document.querySelectorAll(".menu-filter")];
function renderMenu(key){
  let pizzaIndex=0;
  menuContent.innerHTML=menu[key].map(category=>`<section class="menu-category"><div class="menu-category-head"><h3>${category.title}</h3><span>${category.note}</span></div><div class="menu-grid">${category.items.map(([name,description,price])=>{
    const index=pizzaIndex++;
    const visual=key==="pizza"?`<div class="menu-photo" role="img" aria-label="${name}" style="--photo-x:${(index%3)*50}%;--photo-y:${Math.floor(index/3)*20}%"></div>`:"";
    return `<article class="menu-item">${visual}<div class="menu-item-copy"><h4>${name}</h4><span class="price">${price} kr</span>${description?`<p>${description}</p>`:""}</div></article>`
  }).join("")}</div></section>`).join("")
}
filters.forEach(button=>button.addEventListener("click",()=>{filters.forEach(item=>item.classList.remove("is-active"));button.classList.add("is-active");renderMenu(button.dataset.filter)}));
const navToggle=document.querySelector(".nav-toggle");
const nav=document.querySelector("#main-nav");
navToggle.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");navToggle.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("is-open");navToggle.setAttribute("aria-expanded","false")}));
renderMenu("pizza");
