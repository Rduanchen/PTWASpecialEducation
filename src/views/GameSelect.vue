<template>
  <header>
    <!-- <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div id="Function_area">
          <div class="container-fluid">
            <a class="navbar-brand">
              <img src="@/assets/images/nav_bar/logo.png" alt="Logo" class="d-inline-block align-text-top" id="Title_logo">
            </a>
          <div class="col"><p></p></div>

          </div>
      </div>
    </nav> -->
    <nav class="container navbar navbar-expand-sm navbar-light sticky-top justify-content-evenly flex-nowrap" style="width: 100%;">
        <a class="navbar-brand mt-2 mb-2" href="#" alt="Home">
            <img src="@/assets/images/nav_bar/logo.png" />
        </a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" @click="ChangeSubject('Math')"><img src="@/assets/button/math.png"/></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="ChangeSubject('Chinese')"><img src="@/assets/button/chinese.png"></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="ChangeSubject('Technology')"><img src="@/assets/button/technology.png"></a>
            </li>
            </ul>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="輸入ID或者標題" aria-label="Search" v-model="SearchInput">
                <button class="btn btn-primary text-nowrap" type="submit" v-on:click="SearchGame()">搜尋</button>
            </form>
        </div>
        <!-- <div class="container sticky-top" style="width: 30%;--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0" >
            <li class="breadcrumb-item text-white"><i class="bi bi-house"></i><a href="#"> 主頁</a></li>
            <li class="breadcrumb-item active text-white" aria-current="page"><i class="bi bi-book-half"></i><a>  {{Subjects[Subject]}}</a></li>
          </ol>
        </div> -->
        

      </nav>
  </header>
  <section v-if="ShowMenu">
    <div class="d-flex flex-column align-items-center d-grid gap-5 justify-content-center Subject_container"  style="width: 100%; height: 90vh;">
      <p class="h1">請選科目</p>
      <a  v-on:click="ChangeSubject('Math')"><img src="@/assets/button/math.png" style="width: 40vh;" /></a>
      <a  v-on:click="ChangeSubject('Chinese')"><img src="@/assets/button/chinese.png" style="width: 40vh;" /></a>
      <a  v-on:click="ChangeSubject('Technology')"><img src="@/assets/button/technology.png" style="width: 40vh;"/></a>
    </div>
  </section>

  <section class="GameSelectSection" style="overflow-y: hidden;" v-if="ShowContent">
      <div class="container">
          <div class="row">
              <div class="col-3 SideBar mt-4">
                  <div class="card">
                  <div class="card-body" :key="Refresh">
                      <h5 class="card-title mt-2">請選擇科目</h5>
                      <div class="list-group mt-2" v-for="(items,key) in ShowInfo" v-if="ShowInfo">
                        <a class="list-group-item list-group-item-action" v-on:click="SelectChapter(key)">{{ items.Title }}</a>
                      </div>
                  </div>
                </div>
              </div>

              <!-- NF img 的屬性需要修正 fs-->
              <div class="col-8 container ItemFrame mt-4" v-if="Show" :key="Refresh">
                <div class="Charpter mb-4 px-0" v-for="items in ShowInfo[SelectedChapter].Section" v-if="ShowInfo">
                <div>
                    <h5 class="card-title mb-3">{{ items.Title }}</h5>
                    <div class="row GameCardGroup" style="overflow-x: auto;">
                      <div class="row">
                        <div v-for="item in items.Games" class="col-12 col-md-6 col-lg-4 d-flex align-self-stretch">
                          <div class="card GameCard my-2">
                            <div class="card-body">
                              <img src="@/assets/images/pics/cover_info.jpeg" class="card-img-top" alt="...">
                              <router-link :to="{ name: 'Game', params: { id: item.id, Grade: this.ShowGrade, Subject: this.Subject ,GameName: item.Name} }">
                                <p class="h5 card-title mt-2">{{ item.Name }}</p>
                              </router-link>
                              <p class="card-text">{{ item.Description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                </div>
              </div>
          </div>
      </div> 
  </section>
  <section class="Search_result d-flex container d-gap gap-3" v-if="ShowSearch">

    <div v-if="SearchResult==null" class="d-flex flex-column d-grid gap-2 align-items-center justify-content-center" style="width: 100vw; height: 90vh;">
      <p class="h1">沒有搜尋結果</p>
      <button class="btn btn-primary btn-lg" v-on:click="Return2Menu()" style="height: 3em; width: 10rem">返回目錄</button>
    </div>

    <div v-if="SearchResult!=null" style="width: 100vw; height: 90vh;" class="row mt-5">
      <p class="h1 mb-3">搜尋結果:</p>
      <div v-for="item in SearchResult" class="col-12 col-md-6 col-lg-4 d-flex align-self-stretch mb-3">
        <div class="card GameCard col-3" style="width: 18rem; height: 20rem;">
          <div class="card-body">
            <img src="@/assets/images/pics/cover_info.jpeg" class="card-img-top" alt="...">
            <router-link :to="{ name: 'Game', params: { id: item.id, Grade: this.ShowGrade, Subject: this.Subject ,GameName: item.Name} }">
              <p class="h5 card-title mt-2">{{ item.Name }}</p>
            </router-link>
            <p class="card-text">{{ item.Description }}</p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <button class="btn btn-primary btn-block m-5" v-on:click="Return2Menu()" style="height: 3em; width: 20rem">返回目錄</button>
      </div>
      
    </div>
    
  </section>
</template>

<script type="Model">
import fetchJson from '@/utilitys/fetch-json.js';
export default {
data() {
  return {
    SearchInput: "",
    ShowSearch: false,
    SearchResult: [],
    ShowMenu: true,
    ShowContent : false,
    ShowGrade: 0,
    Subject: "Math", //預設科目
    ShowInfo: {},
    MathShowInfo: null,//準備渲染的資料
    ChineseShowInfo: null,
    TechnologyShowInfo: null,
    Subjects:{
      Math: "數學",
      Chinese: "國語",
      Technology: "多元科技",
    },
    SelectedChapter: null,
    Show:false,
    Refresh: 0,
    //定義科目種類
  };
},
created() {
  // 在這裡你可以存取 this.$route.params.id
  this.ShowGrade = this.$route.params.id;
  (async () => {
    var res = await fetchJson("./Grade"+this.ShowGrade+"/MathGrade"+this.ShowGrade+".json");
    this.MathShowInfo = res.data;
    res = await fetchJson("./Grade"+this.ShowGrade+"/ChineseGrade"+this.ShowGrade+".json");
    this.ChineseShowInfo = res.data;
    res = await fetchJson("./Grade"+this.ShowGrade+"/TechnologyGrade"+this.ShowGrade+".json");
    this.TechnologyShowInfo = res.data;
    console.log(this.MathShowInfo,this.ChineseShowInfo,this.TechnologyShowInfo);
    this.ShowInfo = this.MathShowInfo; //預設科目 FIXME
    console.log(this.ShowInfo);
  })();
  
},
methods: {
  SelectChapter(key){
    this.SelectedChapter = String(key);
    console.log(this.SelectedChapter);
    this.Show = true;
  },
  ChangeSubject(Subject){
    console.log("change");
    this.ShowMenu = false;
    this.ShowContent = true;
    this.Subject = Subject;
    if (Subject == "Math")
    {
      this.ShowInfo = this.MathShowInfo;
    }
    else if (Subject == "Chinese")
    {
      this.ShowInfo = this.ChineseShowInfo;
      console.log("Chinens data")
    }
    else if (Subject == "Technology")
    {
      this.ShowInfo = this.TechnologyShowInfo;
    }
    this.Refresh += 1;
    this.Show = false;
  },
  SearchGame(){
    let keyword = this.SearchInput;
    let result = [];
    this.ShowSearch = true;
    this.ShowContent = false;
    this.ShowMenu = false;
    for(var i in this.MathShowInfo){
      for(var z in this.MathShowInfo[i].Section){
        for(var x in this.MathShowInfo[i].Section[z].Games){
          if(this.MathShowInfo[i].Section[z].Games[x].Name.includes(keyword)){
            result.push(this.MathShowInfo[i].Section[z].Games[x]);
          }
          if(this.MathShowInfo[i].Section[z].Games[x].id.includes(keyword)){
            result.push(this.MathShowInfo[i].Section[z].Games[x]);
          }
        }
      }
    }
    for(var i in this.ChineseShowInfo){
      for(var z in this.ChineseShowInfo[i].Section){
        for(var x in this.ChineseShowInfo[i].Section[z].Games){
          if(this.ChineseShowInfo[i].Section[z].Games[x].Name.includes(keyword)){
            result.push(this.ChineseShowInfo[i].Section[z].Games[x]);
          }
          if(this.ChineseShowInfo[i].Section[z].Games[x].id.includes(keyword)){
            result.push(this.ChineseShowInfo[i].Section[z].Games[x]);
          }
        }
      }
    }
    for(var i in this.TechnologyShowInfo){
      for(var z in this.TechnologyShowInfo[i].Section){
        for(var x in this.TechnologyShowInfo[i].Section[z].Games){
          if(this.TechnologyShowInfo[i].Section[z].Games[x].Name.includes(keyword)){
            result.push(this.TechnologyShowInfo[i].Section[z].Games[x]);
          }
          if(this.TechnologyShowInfo[i].Section[z].Games[x].id.includes(keyword)){
            result.push(this.TechnologyShowInfo[i].Section[z].Games[x]);
          }
        }
      }
    }
    if(result.length==0){
      this.SearchResult=null;
    }
    else{
      this.SearchResult=result;
      console.log(this.SearchResult);
    }
  },
  Return2Menu(){
    this.ShowSearch = false;
    this.ShowContent = true;
    this.ShowMenu = false;
  }
},
}
</script>

<style lang="scss" scoped>

header{
background-color: #F19C79;
}
  .navbar {
  background-color: #F19C79; 
  height: 10vh; 
  .navbar-brand {
    img{
      @media (max-width: 576px){
        max-width: 50vw;
      }
      @media (min-width: 576px){
        max-width: 20vw;
      }
    }
  }
  img {
    max-width: 80%;
  }
}

.nav-link{
  transition: transform 0.3s ease; /* 平滑過渡效果 */
}

.ItemFrame {
  height: 83dvh;
  overflow-y: scroll;
  // -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none;
  }
}
.SideBar {
  height: 83dvh;
  overflow-y: scroll;
  // -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none;
  }
}
.GameCardGroup{
// -ms-overflow-style: none; /* IE/Edge */
&::-webkit-scrollbar {
  display: none;
}
}
section{
  height: 90vh;
  background-color: #FFFF;
}

.breadcrumb .breadcrumb-item {
a {
  color: #FFFFFF; /* 替換為你想要的顏色 */
  font-size: 1.2em;
}

}

.GameCard {
transition: transform 0.3s ease; /* 平滑過渡效果 */
}

.GameCard:hover {
transform: scale(1.07); /* 當滑鼠懸停時放大 5% */
}

.nav-link{
transition: transform 0.3s ease; /* 平滑過渡效果 */
}

.Subject_container{
  img:hover{
    transform: scale(1.1);
  }
  img{
    transition: transform 0.3s ease; /* 平滑過渡效果 */
  }
}


</style>