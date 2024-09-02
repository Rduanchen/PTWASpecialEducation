<template>
  <div>
    <header>
      <nav class="container navbar navbar-expand-md sticky-top" style="width: 100%;">
        <a class="navbar-brand mt-2 mb-2 " href="#" alt="Home">
            <img src="@/assets/images/nav_bar/logo.png" />
        </a>
        <form class="mx-auto">
          <button class="btn btn-primary m-1" @click="ChangeSubject('Math')">{{ Subjects['Math'] }}</button>
          <button class="btn btn-primary m-1" @click="ChangeSubject('Chinese')" >{{ Subjects['Chinese'] }}</button>
          <button class="btn btn-primary m-1" @click="ChangeSubject('Technology')" >{{ Subjects['Technology'] }}</button>
        </form>
        <div class="SearchGroup d-flex">
          <input class="form-control" :placeholder=" this.ShowSearch?'按下esc可以返回':'輸入ID或者標題' " v-model="SearchInput" @keyup.enter="SearchGame()" @keyup.esc="Return2Menu()">
          <button class="btn btn-primary text-nowrap" type="submit" v-on:click="SearchGame()">搜尋</button>
        </div>
      </nav>
    </header>
    <section v-if="ShowMenu">
      <div class="d-flex flex-column align-items-center d-grid gap-5 justify-content-center Subject_container"  style="width: 100%; height: 90vh;">
        <p class="h1">請選科目</p>
        <a  v-on:click="ChangeSubject('Math');MakeReadText('' ,'',stop=true)"><img src="@/assets/button/math.png" style="width: 40vh;" /></a>
        <a  v-on:click="ChangeSubject('Chinese');MakeReadText('' ,'',stop=true)"><img src="@/assets/button/chinese.png" style="width: 40vh;" /></a>
        <a  v-on:click="ChangeSubject('Technology');MakeReadText('' ,'',stop=true)"><img src="@/assets/button/technology.png" style="width: 40vh;"/></a>
      </div>
    </section>
    <section class="GameSelectSection" style="overflow-y: hidden;" v-if="ShowContent">
          <div class="SelectIndex">
              <div class="col-lg-2 col-md-3 col-5 SideBar">
                <div>
                  <p class="Title">現在科目</p>
                  <button class="">{{ Subjects[Subject] }}</button>
                  <p class="Title">章節</p>
                  <div class="ButtonContainer">
                    <div v-for="(items,key) in this.ShowInfo" v-if="this.ShowInfo">
                      <button class="list-group-item" @click="() => {SelectChapter(key); MakeReadText('' ,'',stop=true)}">{{ items.Title }}</button>
                    </div>
                  </div>
                </div>                
              </div>

              <!-- 遊戲卡片區域 -->
              <div class="col-7 col-md-9 col-lg-10 container ItemFrame mt-4" v-if="Show" :key="Refresh">
                <div class="Charpter mb-4 px-0" v-for="items in this.ShowInfo[SelectedChapter].Section" v-if="this.ShowInfo">
                <div>
                    <h5 class="card-title mb-4">{{ items.Title }}</h5>
                    <div class="row GameCardGroup p-1">
                      <div class="row">
                        <div v-for="item in items.Games" class="col-12 col-md-6 col-lg-4 d-flex align-self-stretch justify-content-md-center mb-3">
                          <div class="card GameCard my-2 flex-grow-1" style="width: 18rem;">
                            <div class="card-body d-flex flex-column justify-content-between">
                              <img :src="item.Img" class="card-img-top" alt="...">
                              <div class="content d-flex flex-column align-content-end justify-content-end">
                                <a class="h5 card-title mt-2 d-flex flex-row justify-content-between">
                                  <router-link :to="{ name: 'Game', params: { id: item.id, Grade: this.ShowGrade, Subject: this.Subject ,GameName: item.Name} }" @click="MakeReadText('' ,'',stop=true)" class="align-self-center">{{ item.Name }}</router-link><a @click="MakeReadText(item.Name, item.Description)" class="btn btn-primary mx-2"><i class="bi bi-volume-up-fill"></i></a></a>
                                <p class="text-truncate">{{ item.Description }}</p>
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
    <section class="Search_result d-flex container d-gap gap-3" v-if="ShowSearch!=false">
      <div v-if="SearchResult==undefined" class="d-flex flex-column d-grid gap-2 align-items-center justify-content-center" style="width: 100vw; height: 90vh;">
        <div>
          <p class="h1">沒有搜尋結果</p>
          <br>
          <button class="btn btn-primary btn-lg w-100" v-on:click="Return2Menu()" style="height: 3em; width: 10rem">返回目錄</button>
        </div>
      </div>
      <div v-else style="width: 100vw; height: 90vh;" class="row mt-5 justify-content-md-center">
        <p class="h1 mb-3">搜尋結果:</p>
        <div v-for="item in SearchResult" class="col-12 col-md-6 col-lg-4 d-flex align-self-stretch justify-content-md-center mb-3">
            <div class="card GameCard my-2 flex-grow-1" style="width: 18rem;">
              <div class="card-body d-flex flex-column justify-content-between">
                <img :src="item.Img" class="card-img-top" alt="...">
                <div class="content d-flex flex-column align-content-end justify-content-end">
                  <a class="h5 card-title mt-2 d-flex flex-row justify-content-between">
                    <router-link :to="{ name: 'Game', params: { id: item.id, Grade: this.ShowGrade, Subject: this.Subject ,GameName: item.Name} }" @click="MakeReadText('' ,'',stop=true)" class="align-self-center">{{ item.Name }}</router-link><a @click="MakeReadText(item.Name, item.Description)" class="btn btn-primary mx-2"><i class="bi bi-volume-up-fill"></i></a></a>
                  <p class="text-truncate">{{ item.Description }}</p>
                </div>
              </div>
            </div>
        </div>
        <div class="row justify-content-center">
          <button class="btn btn-primary btn-block m-5" v-on:click="Return2Menu()" style="height: 3em; width: 20rem">返回目錄</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import fetchJson from '@/utilitys/fetch-json.js';
import * as RD from '@/utilitys/readtext.js';
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
export default {
data() {
  return {
    SearchInput: "",
    ShowSearch: false,
    SearchResult: [],
    ShowMenu: true,
    ShowContent : false,
    ShowGrade: 0,
    Subject: "", //預設科目
    ShowInfo: null,
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
    voices: [],
    selectedVoice: null,
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
    this.MathShowInfo = await this.ConvertDatasImgURL(this.MathShowInfo);
    this.ChineseShowInfo = await this.ConvertDatasImgURL(this.ChineseShowInfo);
    this.TechnologyShowInfo = await this.ConvertDatasImgURL(this.TechnologyShowInfo);
    let S = this.GetSubjectSession();
    if(S!=null){
      switch(S){
        case "Math":
          this.ShowInfo = this.MathShowInfo;
          this.Subject = "Math";
          break;
        case "Chinese":
          this.ShowInfo = this.ChineseShowInfo; 
          this.Subject = "Chinese";
          break;
        case "Technology":
          this.ShowInfo = this.TechnologyShowInfo;
          this.Subject = "Technology";
          break;
        default:
          this.ShowInfo = this.MathShowInfo;
      }
      this.ShowMenu = false;
      this.ShowContent = true;
    }
    let C = this.GetChapterSession();
    if(C!=null){
      this.SelectedChapter = C;
      this.Show = true;
    }
    RD.InitReadProccess();
  })();
},
methods: {
  GetChapterSession(){
    return sessionStorage.getItem("Chapter");
  },
  GetSubjectSession(){
    return sessionStorage.getItem("Subject");
  },
  ConvertDatasImgURL(datas){
    for (var i in datas){
      for (var z in datas[i].Section){
        for (var x in datas[i].Section[z].Games){
          datas[i].Section[z].Games[x].Img = GamesGetAssetsFile(datas[i].Section[z].Games[x].id, datas[i].Section[z].Games[x].Img);
        }
      }
    }
    return datas;
  },
  MakeReadText(Title,Description,stop=false){
    let text =  `標題:${Title}。說明:${Description}。`;
    // this.ReadText(text);
    RD.ReadText(text,stop);
    console.log(text);
  },
  SelectChapter(key){
    this.Show = false;
    sessionStorage.setItem("Chapter",key);
    this.SelectedChapter = String(key);
    this.Show = true;
  },
  ChangeSubject(Subject){
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
      
    }
    else if (Subject == "Technology")
    {
      this.ShowInfo = this.TechnologyShowInfo;
    }
    sessionStorage.setItem("Subject",Subject);
    sessionStorage.removeItem("Chapter");
    this.Refresh += 1;
    this.Show = false;
  },
  FF(Flist,tar){
    let finded_id = [];
    let find = [];
    for(var i in Flist){
      for(var z in Flist[i].Section){
        for(var x in Flist[i].Section[z].Games){
          if(Flist[i].Section[z].Games[x].id.includes(tar)){
            if(!(finded_id.includes(Flist[i].Section[z].Games[x].id))){
              finded_id.push(Flist[i].Section[z].Games[x].id);
              let temp = Flist[i].Section[z].Games[x];
              find.push(temp);
            }
          }
          if(Flist[i].Section[z].Games[x].Name.includes(tar)){
            if(!(finded_id.includes(Flist[i].Section[z].Games[x].id))){
              finded_id.push(Flist[i].Section[z].Games[x].id);
              let temp = Flist[i].Section[z].Games[x];
              find.push(temp);
            }
          }
        }
      }
    }
    console.log(find);
    if (find.length == 0){
      return undefined;
    }
    return find;
  },
  SearchGame(){
    let keyword = this.SearchInput;
    this.SearchResult = [];
    this.SearchResult=this.FF(this.MathShowInfo,keyword);
    this.ShowSearch = true;
    this.Show = false;
    this.ShowContent = false;
    this.ShowMenu = false;
    this.SearchInput="";
    console.log(this.SearchResult);
  },
  Return2Menu(){
    // location.reload();
    this.MakeReadText('' ,'',stop=true);
    this.ShowSearch = false;
    this.Show = true;
    this.ShowContent = true;
    this.ShowMenu = false;
    this.SearchInput = "";
  },
},
}
</script>

<style lang="scss" scoped>
header{
  background-color: $primary-color;
}
.navbar {
  background-color: $primary-color;
  button{
    background-color: $primary-btn-bg;
    border: solid 1px $primary-btn-bg;
    border-radius: $border-radius;
    margin: 0 1rem;
  }
  button:hover{
    background-color: $primary-btn-hover-bg;
    transform: scale($transform-scale);
  }
  @media (min-width: 768px){
    height: 10vh;
  }
  @media (max-width: 768px){
    height: auto;
  }
  .navbar-brand {
    img{
      @media (max-width: 768px){
        max-width: 50vw;
      }
      @media (min-width: 768px){
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
  padding: 2vh 2vw;
  overflow-y: scroll;
  @media (pointer: fine) { 
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.SideBar {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  display: grid;
  gap: 1vh;
  background-color: $sub-color;
  height: 90vh;
  button{
    width: 100%;
    background-color: $info-btn-bg;
    border: none;
    border-radius: $border-radius;
    color: $secondary-btn-text;
    font-weight: 700;
    font-size: 1.2rem;
    height: 2.6rem;
  }
  .Title{
    font-size: 1.5em;
    margin: 1vh 0;
  }
  .ButtonContainer{
    display: grid;
    gap: 1rem;
    button{
      transition: transform 0.3s ease; /* 平滑的過渡效果 */
      font-size: 1rem;
      font-weight: 800;
      background-color: darken($secondary-btn-bg, 0);
      border-radius: $border-radius;
      color: $secondary-btn-text;
    }
    button:hover{
      transform: scale($transform-scale);
      background-color: $secondary-btn-hover-bg;
    }
  }
  overflow-y: scroll;
  padding: 2vh 2vw;
  @media (pointer: fine) { 
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.GameCardGroup{
  @media (pointer: fine) { 
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none;
    }
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
  height: auto;
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