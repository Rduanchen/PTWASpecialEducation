<template>
    <header>
        <nav class="container-fluid navbar navbar-expand-md navbar-light sticky-top justify-content-around justify-content-md-center"
            style="justify-content: flex-start !important">
            <a class="navbar-brand mx-3" href="#" alt="Home">
                <img src="@/assets/images/nav_bar/logo.png" />
            </a>
            <button class="navbar-toggler btn btn-primary mx-auto" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarText11" aria-controls="navbarText11" aria-expanded="false"
                aria-label="Toggle navigation" @click="PreviousPage">
                上一頁
            </button>
            <div class="collapse navbar-collapse mx-3" id="navbarText">
                <div class="container sticky-top d-flex justify-content-end" style="--bs-breadcrumb-divider: '>'">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <i class="bi bi-house"></i><a href="#"> 主頁</a>
                        </li>
                        <li class="breadcrumb-item" aria-current="page" @click="PreviousPage">
                            <i class="bi bi-book-half"></i>
                            <a>{{ grade }} 年級 {{ subject }}</a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <i class="bi bi-pen"></i><a> {{ gameName }}</a>
                        </li>
                    </ol>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        grade: {
            type: String,
        },
        gameName: {
            type: String,
        },
        subject: {
            type: String,
        }
    },
    methods: {
        PreviousPage() {
            this.$emit('previous-page');
        },

    }

}
</script>

<style scoped lang="scss">
header {
    background-color: #f19c79;
    height: 10vh !important;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.navbar {
    background-color: #f19c79;

    .navbar-brand {
        img {
            @media (max-width: 576px) {
                height: 7vh;
                width: auto;
            }

            @media (min-width: 576px) {
                max-width: 20vw;
            }
        }
    }

    img {
        max-width: 80%;
    }
}

.breadcrumb .breadcrumb-item {
  a {
    color: #fff; /* 替換為你想要的顏色 */
    font-size: 1.2em;
  }
}
</style>