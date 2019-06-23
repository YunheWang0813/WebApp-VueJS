<template>
    <!-- v-if="recipe" for get rid of title=null error -->
    <div v-if="recipe" class="edit-recipe container">
        <h2>Edit {{recipe.title}} </h2>
        <form @submit.prevent="Editrecipe">
            <div class="field title">
                <label for="title" class="font">recipe Title:</label>
                <input type="text" name="title" v-model="recipe.title">
            </div>
            <div v-for="(ing, index) in recipe.ingredients" :key="index" class="field">
                <label for="ingredient" class="font">Ingredient {{index + 1}}:</label>
                <input type="text" name="ingredient" v-model="recipe.ingredients[index]">
                <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
            </div>
            <div class="field add-ingredient">
                <label for="add-ingredient" class="font">Add an ingredient:</label>
                <input type="text" name="add-ingredient" placeholder="Press 'Tab' to add ingredient after filling"
                @keydown.tab.prevent="addIng" v-model="another">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn pink">Update recipe</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'Editrecipe',
    data(){
        return{
            recipe: null,
            another: null,
            feedback: null
        }
    },
    created(){
        // we know slug but not id, so just use slug to determine the particular recipe
        let ref = db.collection('recipes').where('slug', '==', this.$route.params.recipe_slug)
        // snapshot: collection of item
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                // console.log(doc.data())
                this.recipe = doc.data()
                this.recipe.id = doc.id
            })
        })
    },
    methods: {
        Editrecipe(){
            // console.log(this.recipe.title, this.recipe.ingredients)
            if(this.recipe.title && this.recipe.ingredients.length > 0){
                this.recipe.slug = slugify(this.recipe.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                // console.log(this.slug)
                db.collection('recipes').doc(this.recipe.id).update({
                    title: this.recipe.title,
                    ingredients: this.recipe.ingredients,
                    slug: this.recipe.slug
                }).then(() => {
                    this.$router.push({name: 'Index'})
                }).catch(err => {
                    console.log(err)
                })
                this.feedback = null
            }
            else{
                if(!this.recipe.title) this.feedback = 'Please enter a title for this recipe'
                else if(this.recipe.ingredients.length == 0) this.feedback = 'Please provide at least one ingredient for this recipe'
            }
        },
        addIng(){
            if(this.another){
                this.recipe.ingredients.push(this.another)
                // console.log(this.ingredients)
                this.another = null,
                this.feedback = null
            }
            else{
                this.feedback = 'Please enter a value to add an ingredient'
            }
        },
        deleteIng(ing){
            this.recipe.ingredients = this.recipe.ingredients.filter(ingredient => {
                return ingredient != ing
            })
        }
    }
}
</script>

<style>
.edit-recipe{
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}
.edit-recipe h2{
    font-size: 2em;
    margin: 20px auto;
}
.edit-recipe .field{
    margin: 20px auto;
    position: relative;
}
.font{
    font-size: 14px;
    font-weight: bold;
}
::placeholder{
    color:#b9c0cc
}
.edit-recipe .delete{
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
