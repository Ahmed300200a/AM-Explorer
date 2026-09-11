 let data
 let options=document.querySelectorAll("#optionsList li");
 let containerOptions=document.querySelector("#optionsList");
 let cards=document.getElementsByClassName("card");
 let spanName=document.querySelector("#spanName");
 let divConnent=document.querySelector("#connent");
 let flag=document.querySelector(".containerFlag");
 let detailsSection=document.querySelector(".detailsSection");
 let reloadBtn=document.getElementById("reload");
 async function getData(){
const response = await fetch(
    "https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json"
);
 
 data = await response.json();
 console.log(data)

      let countries= makeOptions(data);
      showOptions(countries);
 }
 let getpop=async function(country){
     let response=await fetch("world_population_1980_2020.json")
     let allPopulation=await response.json()
     let population=allPopulation.countries.find((e)=>{
          return e.name==country.name.common
      
     })
     console.log(population)
     return population

 }
 let makeOptions=function(data){
   let countries=[];
   for(let country of data){
    countries.push(country.name.common)
   }
   
   return countries
}
let showOptions=function(countries){
  options.forEach((cn)=>{
    cn.textContent=countries[Math.floor(Math.random()*countries.length)]
    if(cn.textContent=="Israel"){
        showOptions(countries);
        console.log("found forbidden country")
    }
    console.log(cn);
    console.log(cn.textContent)
  })
}
function getFlagEmoji(countryCode) {
    return countryCode
        .toUpperCase()
        .split("")
        .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
        .join("");
}
let  showCountryDetails=function(country){

  cards[0].innerHTML=`<h2>currencies : </h2>
  <p> ${Object.values(country.currencies)
    .map(currency => `${currency.name} (${currency.symbol})`)
    .join(", ")}</p>`
  cards[1].innerHTML=`<h2>Capital : </h2>
  <p> ${country.capital?country.capital[0]:"Not Exist"}</P>`
  cards[2].innerHTML=`<h2>language : </h2>
  <p>${Object.values( country.languages).join(" ,")}</p>`
  cards[3].innerHTML=`<h2>The area : </h2>
  <p>${country.area} KM<sup>2</sup></p>`
  spanName.textContent= country.name.common;
  divConnent.textContent=`${country.region}`
  flag.innerHTML = country.cca2
    ? `<img src="https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png"
        alt="${country.name.common} flag "class="flag">`
    : "Not Found";
    detailsSection.style.display="block"
    makingMap(country)
}
getData()
reloadBtn.onclick=function(){
    let countries= makeOptions(data);
      showOptions(countries);
}
//الجزء الخاص بعرض بيانات الننقر على الاختيارات
containerOptions.addEventListener("click",async(e) =>{
 if(e.target.classList.contains("option")){
    let country=data.find((eee)=>{
       return eee.name.common==e.target.textContent;
        
    }

    
)
     console.log(country)
    showCountryDetails(country)
    let population=await getpop(country)
    drawChart(population)
 }
})
let inputSearch=document.getElementById("searchInput");
let searchBtn=document.getElementById("search-button");
let containerError=document.querySelector(".falsInput");
let text =document.getElementById("pMsg")
let handleSearchError=function(state){
    text.textContent=state.msg;
    containerError.style.transform="translateY(0px)"
    setTimeout(()=>{
      containerError.style.transform="translateY(-230px)"
    },2100)
}
searchBtn.onclick=async function(){
    let search=inputSearch.value;
    if(!search){
        handleSearchError({type:"NO input",msg:"Please Enter the country you want to search about"})
    }else if(search.toUpperCase()==="ISRAEL" || checkIS.test(search)){
        handleSearchError({type:"panned country",msg:"We do not know this country"})
    }else{
        let result=data.find((e)=>{
            return e.name.common.toUpperCase()==search.toUpperCase() || e.translations.ara.common ===search 
        })
        if(result){
            showCountryDetails(result)
             let population=await getpop(result)
             drawChart(population)
        }else{
            handleSearchError({type:"undifined country",msg:"Sorry, Cant find this country"})
        }
    }
}



let checkIS=/^([ie]sr)(.)+(l)$/
//start Chart.js for the selected country
let myChart=null;
let h1
let chart=document.getElementById("myChart").getContext("2d");
let containerCanvas=document.querySelector(".containerCanvas");
let drawChart=function(data){
    let dataPopulation=[];
    console.log(data)
    if(myChart){
        myChart.destroy()
    }
    if(data){
    for(let pop in data.population){
        console.log(pop)
        dataPopulation.push(data.population[pop])
    }
    if(h1){
    h1.style.display="none"
    }
    console.log(dataPopulation)

     myChart=new Chart(chart,{
        type:"bar",
        data:{
            labels:[1980,1990,2000,2010,2020],
            datasets:[{
                label:"population last 5 decades",
                data:dataPopulation,
                borderWidth:1,
                backgroundColor:["red","#da8479b9","#12AACC","blue","#5d7118"]
            }]
        }
    })}
    else{
        if(!h1){
         h1=document.createElement("h1");
        h1.textContent="No data found";
        
     containerCanvas.appendChild(h1);
        }else{
            h1.style.display="flex";
        }
     console.log("hello")
    }
}
//start  map section
let map; 
let makingMap=function(country){
    if(!map){
     map = L.map('map');
    }
    map.setView([country.latlng[0],country.latlng[1]], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([country.latlng[0],country.latlng[1]]).addTo(map)
    .bindPopup('this coutry is  :'+ country.name.common)
    .openPopup();
}