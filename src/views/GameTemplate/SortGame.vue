<template>
    <div class="container">
        <div class="card mb-3">
            <h1>這裡是題目</h1>
            <!-- {{  }} -->
        </div>
        <div class="row justify-content-between">
            <div class="col-7 align-content-between">
                <h1>Chosen</h1>
                <draggable :list="meals" group="meals" class="card">
                    <template #item="{ element: meal }">
                            <button type="button" class="btn btn-primary m-1">{{ meal }}</button>
                    </template>
                </draggable>
            </div>
            <div class="col-5">
                <h1>Group 1</h1>
                <div class="row">
                    <draggable :list="yuckyMeals" group="meals" class="card">
                        <template #item="{ element: meal }">
                                <button type="button" class="btn btn-primary m-1">{{ meal }}</button>
                        </template>
                    </draggable>
                </div>
                <h1>Group 2</h1>
                <div class="row">
                    <draggable :list="shopcart" group="meals" class="card">
                        <template #item="{ element: meal }">
                            <button type="button" class="btn btn-primary m-1">{{ meal }}</button>
                        </template>
                    </draggable>
                </div>
                <div class="row">
                    <button type="button" class="btn btn-primary m-3">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
    name: 'SortGame',
    components: {
        draggable
    },
    data() {
        return {
            meals: [
                'Hamburger',
                'Pizza',
                'Spaghetti',
                'Tacos',
                'Teriyaki Chicken',
            ],
            yuckyMeals: [
                'Bat wing soup',
                'Spicy Octopus',
                'Anything from Taco Bell',
            ],
            shopcart: [

            ],
        }
    }
}
</script>
<style>
.container {
    height: 100vh;
}
.card {
  min-height: 50px;
}

</style>

