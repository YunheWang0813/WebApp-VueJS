<template>
    <div class="add-recipe container">
        <h2 class="center-align indigo-text">Add New recipe Recipe</h2>
        <!-- prevent refreshing page by button (default action) -->
        <form @submit.prevent="Addrecipe">
            <div class="field title">
                <label for="title" class="font">recipe Title:</label>
                <input type="text" name="title" v-model="title">
            </div>
            <div v-for="(ing, index) in ingredients" :key="index" class="field">
                <label for="ingredient" class="font">Ingredient {{index + 1}}:</label>
                <input type="text" name="ingredient" v-model="ingredients[index]">
                <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
            </div>
            <div class="field add-ingredient">
                <label for="add-ingredient" class="font">Add an ingredient:</label>
                <input type="text" name="add-ingredient" placeholder="Press 'Tab' to add ingredient after filling"
                @keydown.tab.prevent="addIng" v-model="another">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn pink">Add recipe</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'Addrecipe',
    data(){
        return{
            title: null,
            another: null,
            ingredients: [],
            feedback: null,
            slug: null
        }
    },
    methods: {
        Addrecipe(){
            // console.log(this.title, this.ingredients)
            if(this.title && this.ingredients.length > 0){
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                // console.log(this.slug)
                db.collection('recipes').add({
                    title: this.title,
                    ingredients: this.ingredients,
                    slug: this.slug
                }).then(() => {
                    this.$router.push({name: 'Index'})
                }).catch(err => {
                    console.log(err)
                })
                this.feedback = null
            }
            else{
                if(!this.title) this.feedback = 'Please enter a title for this recipe'
                else if( this.ingredients.length == 0) this.feedback = 'Please provide at least one ingredient for this recipe'
            }
        },
        addIng(){
            if(this.another){
                this.ingredients.push(this.another)
                // console.log(this.ingredients)
                this.another = null,
                this.feedback = null
            }
            else{
                this.feedback = 'Please enter a value to add an ingredient'
            }
        },
        deleteIng(ing){
            this.ingredients = this.ingredients.filter(ingredient => {
                return ingredient != ing
            })
        }
    },
}
</script>

<style>
.add-recipe{
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}
.add-recipe h2{
    font-size: 2em;
    margin: 20px auto;
}
.add-recipe .field{
    margin: 20px auto;
    position: relative;
}
::placeholder{
    color:#b9c0cc
}
.add-recipe .delete{
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
