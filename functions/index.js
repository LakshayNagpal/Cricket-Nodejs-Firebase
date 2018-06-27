const functions = require('firebase-functions');
const fs = require('fs');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();
var http = require('http');

const host = 'api.edamam.com';
const recipe_api_id = 'e8297cf8';
const recipe_api_key = '025ece12056c837955ebaa635784ef4a';
const superhero_access_token = '1939873512698641';
const host_superhero = 'superheroapi.com'
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.recipe = functions.https.onRequest((request, response) => {

  //https://api.edamam.com/search?q=Balanced&app_id=e8297cf8&app_key=025ece12056c837955ebaa635784ef4a

    switch (request.body.queryResult.action) {

      case 'calorieMeterNo' : {

        // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.number);

        var ingredient, cal ;
        var outcontext = request.body.queryResult.outputContexts;

        for(var i=0;i<outcontext.length; i++){
          var ele = outcontext[i];
          var contextname = ele.name ;
          var contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipewithcalories-followup"){
              ingredient = ele.parameters.ingredientlist;
              cal = ele.parameters.number;
          }
        }

        // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // var ingredient = outcontext.parameters.ingredientlist ;
        // var cal = outcontext.parameters.number ;

        callCalorieApi(ingredient, cal).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of calorieMeterNo executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }

      case 'calorieMeterDiet' : {

        // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.number);

        // outcontext = request.body.queryResult.outputContexts[1];
        // // console.log('length of request.body.queryResult.outputContexts', request.body.queryResult.outputContexts.length);
        // // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // console.log('request.body.queryResult.outputContexts[1]', request.body.queryResult.outputContexts[1]);
        // ingredient = outcontext.parameters.ingredientlist ;
        // cal = outcontext.parameters.number ;
        // var diet = outcontext.parameters.diet ;

        var diet ;
        outcontext = request.body.queryResult.outputContexts;

        for(i=0;i<outcontext.length; i++){
          ele = outcontext[i];
          contextname = ele.name ;
          contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipewithcalories-followup"){
              ingredient = ele.parameters.ingredientlist;
              cal = ele.parameters.number;
              diet = ele.parameters.diet;
          }
        }

        callCalorieWithDietApi(ingredient, cal, diet).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of calorieMeterDiet executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }

      case 'oneIngredientNo' : {

        //console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // outcontext = request.body.queryResult.outputContexts[0];
        // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // ingredient = outcontext.parameters.ingredientlist ;

        outcontext = request.body.queryResult.outputContexts;

        for(i=0;i<outcontext.length; i++){
          ele = outcontext[i];
          contextname = ele.name ;
          contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipetellerwithoneingredient-followup"){
              ingredient = ele.parameters.ingredientlist;
          }
        }



        callRecipeApi(ingredient).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of oneIngredientNo executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }

      case 'oneIngredientDiet' : {

        // // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.number);
        //
        // outcontext = request.body.queryResult.outputContexts[1];
        // // console.log('length of request.body.queryResult.outputContexts', request.body.queryResult.outputContexts.length);
        // // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // console.log('request.body.queryResult.outputContexts[1]', request.body.queryResult.outputContexts[1]);
        // ingredient = outcontext.parameters.ingredientlist ;
        // diet = outcontext.parameters.diet ;


        outcontext = request.body.queryResult.outputContexts;

        for(i=0;i<outcontext.length; i++){
          ele = outcontext[i];
          contextname = ele.name ;
          contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipetellerwithoneingredient-followup"){
              ingredient = ele.parameters.ingredientlist;
              diet = ele.parameters.diet ;
          }
        }


        callRecipeDietApi(ingredient, diet).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of oneIngredientDiet executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }

      case 'multipleIngredientsNo' : {

        // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // console.log('request.body.queryResult.parameters.number', request.body.queryResult.parameters.number);
        //
        // outcontext = request.body.queryResult.outputContexts[0];
        // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // ingredient = outcontext.parameters.ingredientlist ;
        // var ingr = outcontext.parameters.number ;

        var ingr ;
        outcontext = request.body.queryResult.outputContexts;

        for(i=0;i<outcontext.length; i++){
          ele = outcontext[i];
          contextname = ele.name ;
          contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipewithnumberofingredients-followup"){
              ingredient = ele.parameters.ingredientlist;
              ingr = ele.parameters.number;
          }
        }

        callNumIngredientApi(ingredient, ingr).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of multipleIngredientsNo executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }

      case 'multipleIngredientsDiet' : {

        // // console.log('request.body.queryResult.parameters.ingredientlist', request.body.queryResult.parameters.ingredientlist);
        // // console.log('request.body.queryResult.parameters.number', request.body.queryResult.parameters.number);
        //
        // outcontext = request.body.queryResult.outputContexts[1];
        // // console.log('length of request.body.queryResult.outputContexts', request.body.queryResult.outputContexts.length);
        // // console.log('request.body.queryResult.outputContexts[0]', request.body.queryResult.outputContexts[0]);
        // console.log('request.body.queryResult.outputContexts[1]', request.body.queryResult.outputContexts[1]);
        // ingredient = outcontext.parameters.ingredientlist ;
        // ingr = outcontext.parameters.number ;
        // diet = outcontext.parameters.diet ;


        outcontext = request.body.queryResult.outputContexts;

        for(i=0;i<outcontext.length; i++){
          ele = outcontext[i];
          contextname = ele.name ;
          contextfollowup = contextname.split("/")[6];
          if(contextfollowup === "recipewithnumberofingredients-followup"){
              ingredient = ele.parameters.ingredientlist;
              ingr = ele.parameters.number;
              diet = ele.parameters.diet;
          }
        }


        callNumIngredientDietApi(ingredient, ingr, diet).then((output) => {
            response.send({'fulfillmentText': output });
            return console.log(output);
        }).catch(() => {
          console.log('catch block of multipleIngredientsDiet executed');
          response.send({'fulfillmentText' : `I don't about this recipe but I hope I may be useful next time we talk!`});
        })

        break;
      }


      default : {

        response.send({
          'fulfillmentText' : `no action matched in webhook`
        });

        break;
      }
    }
});



function callCalorieApi (recipe, calorie) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key + '&calories=' + calorie;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let cal = response['params']['calories'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${cal} calories!  \nYou can try increasing the number of calories or verify if the food item is written correctly.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          console.log('The index number of the response is', i);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name_calorie_intent', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list_calorie_intent', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          calories = Math.ceil(calories / servings) ;
          console.log('calories_calorie_intent', calories);

          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has ${calories} calories for a single serving!  \n It feels good to teach people how to make unique and delicious food :)`;
          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}


function callCalorieWithDietApi (recipe, calorie, diet) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key + '&calories=' + calorie + '&diet=' + diet ;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let cal = response['params']['calories'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${cal} calories!  \nYou can try increasing the number of calories or verify if the food item is written correctly.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          console.log('The index number of the response is', i);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name_calorie_intent', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list_calorie_intent', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          calories = Math.ceil(calories / servings) ;
          console.log('calories_calorie_intent', calories);

          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}



function callRecipeApi (recipe) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let num_of_ingr = response['params']['ingr'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe}  \n Can you please verify if you have entered the food item correctly or try again with different name.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          console.log('calories', calories);
          calories = Math.ceil(calories / servings) ;
          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}


function callRecipeDietApi (recipe, diet) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key + '&diet=' + diet;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let num_of_ingr = response['params']['ingr'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe}  \n Can you please verify if you have entered the food item correctly or try again with different name.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          console.log('calories', calories);
          calories = Math.ceil(calories / servings) ;
          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}


function callNumIngredientApi (recipe, num_of_ingredient) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key + '&ingr=' + num_of_ingredient;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let num_of_ingr = response['params']['ingr'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${num_of_ingr} ingredients!  \n Please verify if the name of the recipe was entered correctly or else try again with some different recipe.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          console.log('The index number of the response is', i);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name_calorie_intent', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list_calorie_intent', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          calories = Math.ceil(calories);
          let nutrition = response['hits'][i]['recipe']['totalDaily']['ENERC_KCAL']['quantity'];
          nutrition = Math.ceil(nutrition);
          console.log('calories_calorie_intent', calories);

          let output = `The ingredient list of ${recipe_name} Recipe are ${ingredients} and this recipe has ${calories} calories with daily nutrition value of ${nutrition}% which will serve ${servings} people !  \nIt feels good to teach people how to make unique and delicious food :)`;

          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}


function callNumIngredientDietApi (recipe, num_of_ingredient, diet) {
  return new Promise((resolve, reject) => {
    let recipe_uri = recipe.split(" ").join("+");
    let path = '/search?q=' + recipe_uri + '&app_id=' + recipe_api_id +
    '&app_key=' + recipe_api_key + '&ingr=' + num_of_ingredient + '&diet=' + diet;
    console.log('API Request: ' + host + path);

    http.get({host: host, path: path}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {

        let response = JSON.parse(body);
        if (response['count'] === 0) {
          let asked_recipe = response['q'];
          let num_of_ingr = response['params']['ingr'][0];
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${num_of_ingr} ingredients!  \n Please verify if the name of the recipe was entered correctly or else try again with some different recipe.`;

          resolve(output);

        } else {
          let length = response['hits'].length ;
          let i = Math.floor(Math.random() * length);
          console.log('The index number of the response is', i);
          let recipe_name = response['hits'][i]['recipe']['label'];
          console.log('recipe_name_calorie_intent', recipe_name);
          let servings = response['hits'][i]['recipe']['yield'];
          let ingredient_list = response['hits'][i]['recipe']['ingredientLines'];
          var ingredients = '';
          ingredient_list.forEach((doc) => {ingredients = ingredients + doc + '  \n'});
          console.log('ingredient_list_calorie_intent', ingredient_list);
          let calories = response['hits'][i]['recipe']['calories'];
          calories = Math.ceil(calories);
          let nutrition = response['hits'][i]['recipe']['totalDaily']['ENERC_KCAL']['quantity'];
          nutrition = Math.ceil(nutrition);
          console.log('calories_calorie_intent', calories);

          let output = `The ingredient list of ${recipe_name} Recipe are ${ingredients} and this recipe has ${calories} calories with daily nutrition value of ${nutrition}% which will serve ${servings} people !  \nIt feels good to teach people how to make unique and delicious food :)`;

          resolve(output);

        }

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}






exports.superhero = functions.https.onRequest((request, response) => {

  var super_name, super_publisher, intelligence, strength, speed, durability, power, combat, image_superhero ;

  switch (request.body.queryResult.action) {

    case 'superHeroCard': {

      var name_superhero = request.body.queryResult.parameters.superhero_entity;

      superHero_with_name(name_superhero).then((output) => {
          // response.send({'fulfillmentText': `Success!!!` });
          console.log("output in exports", output);
          var res = output.response ;
          console.log("output.response", res);
          if(res === 'success'){

            var result_arr = output.results ;
            var text_1 = `Now, for which characteristic, You want to challenge me with my SuperHero` ;
            console.log("text_1", text_1);
            super_name = output.results[0].name ;
            console.log("super_name", super_name);
            super_publisher = output.results[0].biography.publisher ;
            intelligence = output.results[0].powerstats.intelligence ;
            strength = output.results[0].powerstats.strength ;
            speed = output.results[0].powerstats.speed ;
            durability = output.results[0].powerstats.durability ;
            power = output.results[0].powerstats.power ;
            combat = output.results[0].powerstats.combat ;
            image_superhero = output.results[0].image.url ;

            console.log("intelligence", intelligence);
            console.log("combat", combat);
            console.log("image_url", image_superhero);

            response.send({
            "payload": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Here's your Super Hero"
                      }
                    },
                    {
                      "basicCard": {
                        "title": super_name,
                        "subtitle": super_publisher,
                        "formattedText": `Your SuperHero is the mighty **${super_name}**.  \n**INTELLIGENCE** *${intelligence}*  \n**STRENGTH** *${strength}*  \n**SPEED** *${speed}*  \n**DURABILITY** *${durability}*  \n**POWER** *${power}*  \n**COMBAT** *${combat}*`,
                        "image": {
                          "url": image_superhero,
                          "accessibilityText": super_name
                        },
                        // "buttons": [
                        //   {
                        //     "title": "Button Title",
                        //     "openUrlAction": {
                        //       "url": "https://www.google.com"
                        //     }
                        //   }
                        // ],
                        "imageDisplayOptions": "CROPPED"
                      }
                    },
                    {
                      "simpleResponse": {
                        "textToSpeech": text_1
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "Intelligence"
                    },
                    {
                      "title": "Strength"
                    },
                    {
                      "title": "Speed"
                    },
                    {
                      "title": "Durability"
                    },
                    {
                      "title": "Power"
                    },
                    {
                      "title": "Combat"
                    }
                  ]
                }
              }
            }
        });

          } else {
            console.log("else block executed when no superhero found in API")
            response.send({'fulfillmentText': `Sorry, I cannot find the superhero you're finding! But you can become one by helping and motivating people.`});
          }
          return console.log(output);
      }).catch(() => {
        console.log('catch block of superhero executed');
        response.send({'fulfillmentText' : `supero catch block executed`});
      })


      break;
    }

    case 'characteristic': {
      console.log("characteristic block ke andar ghus gaya");
      var characteristic_chosen = request.body.queryResult.parameters.characteristic ;
      console.log("characteristic_chosen", characteristic_chosen);
      var characteristic_compare_user = '' ;
      var characteristic_compare_ass = '' ;
      var winner_text = '' ;
      var ass_id = Math.floor(Math.random() * 731);

      var user_chosen_character = '' ;
      var outcontext = request.body.queryResult.outputContexts;

      for(i=0;i<outcontext.length; i++){
        ele = outcontext[i];
        contextname = ele.name ;
        contextfollowup = contextname.split("/")[6];
        if(contextfollowup === "superhero-context"){
            user_chosen_character = ele.parameters.superhero_entity;
        }
      }

      console.log("user_chosen_character", user_chosen_character);

      superHero_with_name(user_chosen_character).then((output) => {
          // response.send({'fulfillmentText': `Success!!!` });
          console.log("output in exports character block with name in character block", output);
          var res = output.response ;
          console.log("output.response character block with name in character block", res);
          if(res === 'success'){
            var powerstat = output.results[0].powerstats ;
            console.log("powerstat in name character block", powerstat);
            console.log("powerstat[characteristic_chosen]", powerstat[characteristic_chosen]);
            characteristic_compare_user = powerstat[characteristic_chosen];


            superHero_with_random_id(ass_id).then((output1) => {

                console.log("output in exports character block with id in character block", output1);
                var res_random_id = output1.response ;
                console.log("output.response character block with id in character block", res_random_id);
                if(res_random_id === 'success'){
                  console.log("res_random_id executed", res_random_id);

                  super_name = output1.name ;
                  super_publisher = output1.biography.publisher ;
                  intelligence = output1.powerstats.intelligence ;
                  strength = output1.powerstats.strength ;
                  speed = output1.powerstats.speed ;
                  durability = output1.powerstats.durability ;
                  power = output1.powerstats.power ;
                  combat = output1.powerstats.combat ;
                  image_superhero = output1.image.url ;

                  characteristic_compare_ass = output1.powerstats[characteristic_chosen] ;

                  if(parseInt(characteristic_compare_ass) > parseInt(characteristic_compare_user)){
                    winner_text = `Yeah!!! ${super_name} won against ${user_chosen_character} in terms of ${characteristic_chosen}.`
                  } else if(parseInt(characteristic_compare_ass) < parseInt(characteristic_compare_user)){
                    winner_text = `${user_chosen_character} has defeated ${super_name}. I must say Smart Move by you.`
                  } else {
                    winner_text = `Both of our Super Heros were hypnotised with Wonder Woman's charm and lost control. Hence It's a Draw.`
                  }

                  response.send({
                  "payload": {
                    "google": {
                      "expectUserResponse": false,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": `My Super Hero against your Fearsome ${user_chosen_character} is`
                            }
                          },
                          {
                            "basicCard": {
                              "title": super_name,
                              "subtitle": super_publisher,
                              "formattedText": `My SuperHero is the vigorous **${super_name}**.  \n**INTELLIGENCE** *${intelligence}*  \n**STRENGTH** *${strength}*  \n**SPEED** *${speed}*  \n**DURABILITY** *${durability}*  \n**POWER** *${power}*  \n**COMBAT** *${combat}*`,
                              "image": {
                                "url": image_superhero,
                                "accessibilityText": super_name
                              },
                              // "buttons": [
                              //   {
                              //     "title": "Button Title",
                              //     "openUrlAction": {
                              //       "url": "https://www.google.com"
                              //     }
                              //   }
                              // ],
                              "imageDisplayOptions": "CROPPED"
                            }
                          },
                          {
                            "simpleResponse": {
                              "textToSpeech": winner_text
                            }
                          }
                        ]
                      }
                    }
                  }
              });

                } else {
                  console.log("character block executed of random id else block executed when no superhero found in API")
                  response.send({'fulfillmentText': `res returned error in characteristic block`});
                }
                return console.log(output);
            }).catch(() => {
              console.log('catch block of characteristic random id wala executed');
            })





          } else {
            console.log("character block executed else block executed when no superhero found in API")
            response.send({'fulfillmentText': `Character block executed Sorry, I cannot find the superhero you're finding! But you can become one by helping and motivating people.`});
          }
          return console.log(output);
      }).catch(() => {
        console.log('catch block of characteristic name wala executed');
      })

      break;
    }


    default: {

      response.send({
        'fulfillmentText': `default block executed`
      })

      break;
    }


  }     // closing brace of switch block

});



function superHero_with_name (name) {
  return new Promise((resolve, reject) => {
    var encoded_superhero_name = name.split(" ").join("%20");
    var path_superhero = '/api.php/' + superhero_access_token + '/search/' + encoded_superhero_name ;
    console.log('API Request: ' + host_superhero + path_superhero);

    http.get({host: host_superhero, path: path_superhero}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {
        console.log("BODY:", body);
        let output = JSON.parse(body);
        resolve(output);

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}


function superHero_with_random_id (id) {
  return new Promise((resolve, reject) => {
    var path_superhero = '/api.php/' + superhero_access_token + '/' + id ;
    console.log('API Request: ' + host_superhero + path_superhero);

    http.get({host: host_superhero, path: path_superhero}, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {
        console.log("BODY:", body);
        let output = JSON.parse(body);
        resolve(output);

      });
      res.on('error', (error) => {
        console.log(`Error while calling the API ${error}` );
      });
    });
  });
}




exports.oddeven = functions.https.onRequest((request, response) => {

  // var full_session_id = request.body.session;
  // var session = full_session_id.split("/")[4];
  //var session = request.body.originalDetectIntentRequest.payload.user.userId ;

  let userStorage = request.body.originalDetectIntentRequest.payload.user.userStorage || JSON.stringify({});
  let userId;
  //console.log("userStorage", userStorage);
  userStorage = JSON.parse(userStorage);
  //console.log("userStorage_after_parsing", userStorage);

  if (userStorage.hasOwnProperty('userId')) {
    userId = userStorage.userId;
    //console.log("userID In if", userId);
  } else {
    // Uses the "uuid" package. You can get this with "npm install --save uuid"
    // var uuid = require('uuid/v4');
    var uuid = require('uuid/v4');
    userId = uuid();
    userStorage.userId = userId
  }

  console.log("userID", userId);


  switch(request.body.queryResult.action) {

    case 'generatenumber' : {


      let params = request.body.queryResult.parameters ;
      let runs = request.body.queryResult.parameters.runs.number ;

      runs = Math.floor(runs);
      if(runs <= 0 || runs > 6){
        response.send({
          'payload': {
            'google': {
              'userStorage': JSON.stringify(userStorage),
              "expectUserResponse": true,
              "richResponse": {
                "items": [
                  {
                    "simpleResponse": {
                      "textToSpeech": `You can only hit from 1 run to 6 runs.`
                    }
                  }
                ],
                "suggestions": [
                  {
                    "title": "1"
                  },
                  {
                    "title": "2"
                  },
                  {
                    "title": "3"
                  },
                  {
                    "title": "4"
                  },
                  {
                    "title": "5"
                  },
                  {
                    "title": "6"
                  }
                ]
                // "linkOutSuggestion": {
                //   "destinationName": "Website",
                //   "url": "https://assistant.google.com"
                // }
              }
            }
          }

        })
      } else {

      var ass_run = Math.floor(Math.random() * 6) + 1;
    //console.log("card outside", card);

      if(ass_run === runs){
        var card = { };
        var fields = firestore.collection('game').doc(userId);
        fields.get()
        .then( doc => {
          if(!doc.exists){
            console.log('No duch document!');
            response.send({
              'payload': {
                'google': {
                  'userStorage': JSON.stringify(userStorage),
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": `We both hit ${runs} runs. Sorry, You're out on the first ball!`
                        }
                      },
                      {
                        "simpleResponse": {
                          "textToSpeech": `Unluckily, Your total score is 0 run.  \nWould you like to play again with me?`
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "yes"
                      },
                      {
                        "title": "no"
                      }
                    ]
                    // "linkOutSuggestion": {
                    //   "destinationName": "Website",
                    //   "url": "https://assistant.google.com"
                    // }
                  }
                }
              }

            });
          } else {
            card = doc.data();
            //console.log("doc_data_else", doc.data());
            //console.log("total_player in card", card['total_player']);
            var runs_scored = card['total_player'];
            var max_runs = card['max_runs'];

            card['total_player'] = 0;
            card['times_played'] += 1;
            if(runs_scored > max_runs){
              card['max_runs'] = runs_scored;
            }
            //console.log("card after adding times played", card);

            firestore.collection('game').doc(userId).set(card)
              .then(() => {
                response.send({
                  'payload': {
                    'google': {
                      'userStorage': JSON.stringify(userStorage),
                      "expectUserResponse": true,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": `We both hit ${runs} runs. Sorry, You're out!  \nYour total score is ${runs_scored} runs.`
                            }
                          },
                          {
                            "simpleResponse": {
                              "textToSpeech": `Would you like to play again with me?`
                            }
                          }
                        ],
                        "suggestions": [
                          {
                            "title": "yes"
                          },
                          {
                            "title": "no"
                          }
                        ]
                        // "linkOutSuggestion": {
                        //   "destinationName": "Website",
                        //   "url": "https://assistant.google.com"
                        // }
                      }
                    }
                  }

                });
                return console.log("max_runs", max_runs);
              })
              .catch((e => {

                console.log('error: ', e);

                response.send({
               'fulfillmentText' : `something went wrong when writing to database`,
               'payload': {
                 'google': {
                   'userStorage': JSON.stringify(userStorage)
                 }
               }

                  });
              }))

          }
          return console.log("card when runs are equal", card);
        })
        .catch((e => {
          console.log('error from database when runs are equal', e);
        }));

        // card['total_player'] = 0;
        // card['times_played'] += 1;

      } else {
        card = { };
        card['total_player'] = runs;
        card['times_played'] = 0;
        card['max_runs'] = 0;
        console.log(card);
        //I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.
        fields = firestore.collection('game').doc(userId);
        fields.get()
        .then( doc => {
            if(!doc.exists){
              firestore.collection('game').doc(userId).set(card)
                .then(() => {
                  response.send({
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage),
                        "expectUserResponse": true,
                        "richResponse": {
                          "items": [
                            {
                              "simpleResponse": {
                                "textToSpeech": `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`
                              }
                            }
                          ],
                          "suggestions": [
                            {
                              "title": "1"
                            },
                            {
                              "title": "2"
                            },
                            {
                              "title": "3"
                            },
                            {
                              "title": "4"
                            },
                            {
                              "title": "5"
                            },
                            {
                              "title": "6"
                            }
                          ]
                          // "linkOutSuggestion": {
                          //   "destinationName": "Website",
                          //   "url": "https://assistant.google.com"
                          // }
                        }

                      }
                    }
                  });
                  return console.log("total runs in card", card);
                })
                .catch((e => {

                  console.log('error: ', e);

                  response.send({
                 'fulfillmentText' : `something went wrong when writing to database`,
                 'payload': {
                   'google': {
                     'userStorage': JSON.stringify(userStorage)
                   }
                 }
                    });
                }))


            } else {
              card = doc.data();
              //console.log("doc_data_else", doc.data());
              //console.log("total_player in card", card['total_player']);
              card['total_player'] = card['total_player'] + runs;
              //console.log("card after adding runs", card);

              firestore.collection('game').doc(userId).set(card)
                .then(() => {
                  response.send({
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage),
                        "expectUserResponse": true,
                        "richResponse": {
                          "items": [
                            {
                              "simpleResponse": {
                                "textToSpeech": `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`
                              }
                            }
                          ],
                          "suggestions": [
                            {
                              "title": "1"
                            },
                            {
                              "title": "2"
                            },
                            {
                              "title": "3"
                            },
                            {
                              "title": "4"
                            },
                            {
                              "title": "5"
                            },
                            {
                              "title": "6"
                            }
                          ]
                          // "linkOutSuggestion": {
                          //   "destinationName": "Website",
                          //   "url": "https://assistant.google.com"
                          // }
                        }

                      }
                    }

                  });

                  // response.send({
                  //   'fulfillmentText' : `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`,
                  //   'payload': {
                  //     'google': {
                  //       'userStorage': JSON.stringify(userStorage)
                  //     }
                  //   }
                  //
                  // });

                  return console.log("total runs in card", card);
                })
                .catch((e => {

                  console.log('error: ', e);

                  response.send({
                 'fulfillmentText' : `something went wrong when writing to database`,
                 'payload': {
                   'google': {
                     'userStorage': JSON.stringify(userStorage)
                   }
                 }
                    });
                }))

            }
            return console.log("card when runs are not equal", card);
          })
        .catch((e => {
          console.log('error from database', e);
        }));


        }
      }



      break;
    }

    case 'maximumruns' : {

      var player_data = firestore.collection('game').doc(userId);
      player_data.get()
      .then(doc => {
        if(!doc.exists){
          console.log('No such document!');
          response.send({
            'payload': {
              'google': {
                'userStorage': JSON.stringify(userStorage),
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": `You have scored a maximum of 0 run. Would you like to play again?`
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "yes"
                    },
                    {
                      "title": "no"
                    }
                  ],
                  // "linkOutSuggestion": {
                  //   "destinationName": "Website",
                  //   "url": "https://assistant.google.com"
                  // }
                }
              }
            }
          });
        } else {
          var max_card = doc.data();
          var max_runs = max_card['max_runs'];
          var num_plays = max_card['times_played'];

          response.send({
            'payload': {
              'google': {
                'userStorage': JSON.stringify(userStorage),
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": `You have scored a maximum of ${max_runs} runs in ${num_plays} matches. Keep up the good play!`
                      }
                    },
                    {
                      "simpleResponse": {
                        "textToSpeech": `Would you like to play with me again?`
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "yes"
                    },
                    {
                      "title": "no"
                    }
                  ]

                }
              }
            }

          });
        }
        return console.log("max_runs", max_runs);
      })
      .catch((e => {

        console.log('error: ', e);

        response.send({
       'fulfillmentText' : `something went wrong when writing to database`,
       'payload': {
         'google': {
           'userStorage': JSON.stringify(userStorage)
         }
       }

          });
      }))

      break;
    }

    default: {

      response.send({
        'fulfillmentText' : `no action matched in webhook`,
        'payload': {
          'google': {
            'userStorage': JSON.stringify(userStorage)
          }
        }
      });

      break;
    }

  }

});


exports.webhook = functions.https.onRequest((request, response) => {

    // console.log("The query text is" , request.body.queryResult.queryText);
    console.log("request.body.queryResult.parameters", request.body.queryResult.parameters);
    console.log("request.body.originalDetectIntentRequest.payload", request.body.originalDetectIntentRequest.payload);

    let userStorage = request.body.originalDetectIntentRequest.payload.user.userStorage || JSON.stringify({});
    let userId;
    console.log("userStorage", userStorage);
    userStorage = JSON.parse(userStorage);
    console.log("userStorage_after_parsing", userStorage);

    // if a value for userID exists un user storage, it's a returning user so we can
    // just read the value and use it. If a value for userId does not exist in user storage,
    // it's a new user, so we need to generate a new ID and save it in user storage.
    if (userStorage.hasOwnProperty('userId')) {
      userId = userStorage.userId;
      console.log("userID In if", userId);
    } else {
      // Uses the "uuid" package. You can get this with "npm install --save uuid"
      // var uuid = require('uuid/v4');
      var uuid = require('uuid/v4');
      userId = uuid();
      userStorage.userId = userId
    }

    console.log("userID", userId);

    // ... Do stuff with the userID

    // Make sure you include the userStorage as part of the response
    // var responseBody = {
    //   payload: {
    //     google: {
    //       userStorage: userStorage,
    //       // ...
    //     }
    //   }
    // };

    switch (request.body.queryResult.action) {
      case 'FeedbackAction': {

            let params = request.body.queryResult.parameters;
            // let text = request.body.queryResult.queryText;
            //database
            // var full_session_id = request.body.session;
            // var session = full_session_id.split("/")[4];

            firestore.collection('users').doc(userId).set(params)
              .then(() => {

              response.send({
                'fulfillmentText' : `Thank You for visiting our ${params.resortLocation} hotel branch and giving us ${params.rating} and your comment as ${params.comments}.` ,
                'payload': {
                  'google': {
                    'userStorage': JSON.stringify(userStorage) ,
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Howdy! I can tell you fun facts about almost any number."
                          }
                        },
                        {
                          "simpleResponse": {
                            "textToSpeech": "What number do you have in mind?"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "25"
                        },
                        {
                          "title": "45"
                        },
                        {
                          "title": "Never mind"
                        }
                      ],
                      "linkOutSuggestion": {
                        "destinationName": "Website",
                        "url": "https://assistant.google.com"
                      }
                    }


                  }
                }


                });
                return console.log("resort location", params.resortLocation);
            })
            .catch((e => {

              console.log('error: ', e);

              response.send({
             'fulfillmentText' : `something went wrong when writing to database`,
             'payload': {
               'google': {
                 'userStorage': JSON.stringify(userStorage)
               }
             }
                });
            }))



        break;
      }
        case 'countFeedbacks':{

          var docRef = firestore.collection('users').doc(userId);

          docRef.get().then(doc => {
              if (doc.exists) {
                  // console.log("Document data:", doc.data());
                  var dat = doc.data();
                  response.send({
                    'fulfillmentText' : `You have given feedback for ${dat.resortLocation} and rating as ${dat.rating}`,
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage)
                      }
                    }
                  });

              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");

                  response.send({
                    'fulfillmentText' : `No feedback found in our database`,
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage)
                      }
                    }
                  });

              }
              return console.log("userStorage_then_wala", userStorage);
          }).catch((e => {
              console.log("Error getting document:", error);
              response.send({
                'fulfillmentText' : `something went wrong while reading from the database`,
                'payload': {
                  'google': {
                    'userStorage': JSON.stringify(userStorage)
                  }
                }
              })
          }));

          break;
        }

        case 'ShowFeedbacks':{

          firestore.collection('users').get()
            .then((snapshot) => {

              var feedbacks = [];
              snapshot.forEach((doc) => { feedbacks.push(doc.data())});

              var show_all_feedback = ``;

              feedbacks.forEach((eachFeedback, index) => {

              show_all_feedback += `number ${index + 1} feedback is Thank You for visiting our
                                  ${eachFeedback.resortLocation} and giving us ${eachFeedback.rating}
                                  and your comment as ${eachFeedback.comments}. \n`
              })

              response.send({
                'fulfillmentText' : show_all_feedback
              });
              return console.log("showfeedbacks", show_all_feedback);
            })
            .catch((err) => {
              console.log("error getting document", err);

              response.send({
                'fulfillmentText' : `something went wrong while reading from the database`
              })
            })

          break;
        }

      default: {
      response.send({
        'fulfillmentText' : `no action matched in webhook`
      })
    }
    }
});

//
// var medical_json = {
//   "Symptomatic Cholelithiasis": {
//       "Symptoms": "Typical symptoms of cholelithiasis include pain in the upper right belly and nausea. Other symptoms may include vomiting and bloating. Pain may be worse after eating, especially after fatty foods.",
//       "Risks": "Gallstones are more common in women and people who are overweight. They also become more common as people age, and are uncommon in children and teenagers. Gallstones form over time and sometimes never lead to symptoms. They cause symptoms when a gallstone gets stuck in the outlet of the gallbladder or in the bile duct when the gallbladder squeezes bile into the intestine.",
//       "Diagnosis": "Diagnosis is based on assessment of the symptoms and physical examination. An ultrasound scan can show the presence of gallstones in the gallbladder or the bile duct. Blood tests to test for infection and liver function might be necessary.",
//       "What is symptomatic cholelithiasis?": "Cholelithiasis is a condition where gallstones are formed in the gallbladder, liver or bile duct. The gallbladder stores bile, a liquid produced by the liver to digest fatty foods. After eating, the gallbladder squeezes bile down the bile tract and into the intestine. The gallstone(s) usually develop over time and exist before symptoms occur. It is a common condition that can affect everyone but occurs more often in women than in men and becomes more common with age. Typical symptoms include short-duration, repetitive pain in the upper and upper right region of the belly.",
//       "Prevention": "Avoiding fatty food and losing weight gradually may help avoid episodes of symptoms.",
//       "Treatment": "Treatment of cholelithiasis involves management of pain and, eventually, removal of the gallstones. Pain-relieving medications (ibuprofen, paracetamol) can be helpful to manage pain. Some people may need antibiotics if there are signs of infection of the gallbladder or bile duct. Surgical removal of the gallbladder (a cholecystectomy) is a common procedure and is helpful in curing symptomatic cholelithiasis."
//   }
// };

// var string_medical_data = JSON.stringify(medical_json);
// var json_medical = JSON.parse(string_medical_data);

// exports.medical = functions.https.onRequest((request, response) => {
//
// var batch = firestore.batch();
//   for(var myKey in json_medical) {
//     var myKeyRef = firestore.collection('medical').doc(myKey);
//     batch.set(myKeyRef, json_medical[myKey]);
//   }
//   batch.commit().then(function () {
//     response.send({
//       'fulfillmentText': `Success!!!`
//     });
//     return console.log("added all medical values in database")
//   })
//   .catch((e => {
//     console.log(e);
//
//     response.send({'fulfillmentText':`Failed!!!`});
//   }))
//
// });

var country_json = {
  "Spain" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "United States of America" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Indonesia" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "United Kingdom of Great Britain and Northern Ireland" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Sri Lanka" : {
    1:{
      "pack_rental":498,
      "effective_rental":498,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":1197,
      "effective_rental":119,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":2498,
      "effective_rental":83,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Singapore" : {
    1:{
      "pack_rental":498,
      "effective_rental":498,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":1197,
      "effective_rental":119,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":2498,
      "effective_rental":83,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Malaysia" : {
    1:{
      "pack_rental":498,
      "effective_rental":498,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":1197,
      "effective_rental":119,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":2498,
      "effective_rental":83,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Nepal" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Hong Kong" : {
    1:{
      "pack_rental":646,
      "effective_rental":646,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":2998,
      "effective_rental":299,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":3997,
      "effective_rental":133,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Thailand" : {
    1:{
      "pack_rental":498,
      "effective_rental":498,
      "validity":1,
      "incoming_calls":"unlimited",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":1197,
      "effective_rental":119,
      "validity":10,
      "incoming_calls":"unlimited",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":2498,
      "effective_rental":83,
      "validity":30,
      "incoming_calls":"unlimited",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  },
  "Morocco" : {
    1:{
      "pack_rental":994,
      "effective_rental":994,
      "validity":1,
      "incoming_calls":"100 mins",
      "free_data":"500 MB",
      "free_minutes_India_local":100,
      "free_sms":100
    },
    10:{
      "pack_rental":3995,
      "effective_rental":399,
      "validity":10,
      "incoming_calls":"250 mins",
      "free_data":"3 GB",
      "free_minutes_India_local":250,
      "free_sms":100
    },
    30:{
      "pack_rental":6999,
      "effective_rental":233,
      "validity":30,
      "incoming_calls":"500 mins",
      "free_data":"5 GB",
      "free_minutes_India_local":500,
      "free_sms":100
    }
  }
}

exports.airtel = functions.https.onRequest((request, response) => {
  var days = request.body.queryResult.parameters.days ;
  console.log("days", days);

  var country = request.body.queryResult.parameters.country ;
  console.log("country", country);

  var string_country = JSON.stringify(country_json);
  var parse_country = JSON.parse(string_country);

  var day_plan;

  if(days < 0){
    response.send({'fulfillmentText' : `Days cannot be in negative`});
  } else if(days === 1){
    day_plan = 1;

    var pack_rental = parse_country[country][day_plan].pack_rental ;
    var effective_rental = parse_country[country][day_plan].effective_rental ;
    var validity = parse_country[country][day_plan].validity ;
    var incoming_calls = parse_country[country][day_plan].incoming_calls ;
    var free_data = parse_country[country][day_plan].free_data ;
    var free_minutes_India_local = parse_country[country][day_plan].free_minutes_India_local ;
    var free_sms = parse_country[country][day_plan].free_sms ;

    response.send({
      'payload': {
        'google': {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Awesome! Finding the best pack for you."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": `I feel great to hear that you're visiting ${country} so the best plan I can offer for your entourage is Rs ${pack_rental} per day for ${days} day which cost you Rs ${pack_rental * days}  \n This pack includes ${incoming_calls} incoming calls, 500 MB free data, ${free_minutes_India_local * days} free minutes to India or Local and ${free_sms * days} SMSs with ${validity * days} day validity.`
                }
              }
            ],
            "suggestions": [
              {
                "title": "Purchase this pack"
              },
              {
                "title": "exit"
              }
            ]
          }
        }
      }


    });

  } else if(days === 2 || days === 3 || days === 4){
    day_plan = 1;

    pack_rental = parse_country[country][day_plan].pack_rental ;
    effective_rental = parse_country[country][day_plan].effective_rental ;
    validity = parse_country[country][day_plan].validity ;
    incoming_calls = parse_country[country][day_plan].incoming_calls ;
    free_data = parse_country[country][day_plan].free_data ;
    free_minutes_India_local = parse_country[country][day_plan].free_minutes_India_local ;
    free_sms = parse_country[country][day_plan].free_sms ;

    response.send({
      'payload': {
        'google': {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Awesome! Finding the best pack for you."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": `I feel great to hear that you're visiting ${country} so the best plan I can offer for your entourage is Rs ${effective_rental} per day for ${days} days which cost you ${pack_rental * days}  \n This pack includes ${incoming_calls} incoming calls, 1000 MB free data, ${free_minutes_India_local * days} free minutes to India or Local and ${free_sms * days} SMSs with ${validity * days} days validity.`
                }
              }
            ],
            "suggestions": [
              {
                "title": "Purchase this pack"
              },
              {
                "title": "exit"
              }
            ]
          }
        }
      }

    });

  } else if(days <= 10){
    day_plan = 10;

    pack_rental = parse_country[country][day_plan].pack_rental ;
    effective_rental = parse_country[country][day_plan].effective_rental ;
    validity = parse_country[country][day_plan].validity ;
    incoming_calls = parse_country[country][day_plan].incoming_calls ;
    free_data = parse_country[country][day_plan].free_data ;
    free_minutes_India_local = parse_country[country][day_plan].free_minutes_India_local ;
    free_sms = parse_country[country][day_plan].free_sms ;

    response.send({
      'payload': {
        'google': {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Awesome! Finding the best pack for you."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": `I feel great to hear that you're visiting ${country} so the best plan I can offer for your entourage is Rs ${effective_rental} per day for 10 days which cost you ${pack_rental}  \nThis pack includes ${incoming_calls} incoming calls, ${free_data} free data, ${free_minutes_India_local} free minutes to India or Local and ${free_sms} SMSs with ${validity} days validity.`
                }
              }
            ],
            "suggestions": [
              {
                "title": "Purchase this pack"
              },
              {
                "title": "exit"
              }
            ]
          }
        }
      }

    });

  } else if(days === 11) {
    day_plan = 10;
    var rem_days = days % day_plan ;
    pack_rental = parse_country[country][day_plan].pack_rental ;
    effective_rental = parse_country[country][day_plan].effective_rental ;
    validity = parse_country[country][day_plan].validity ;
    incoming_calls = parse_country[country][day_plan].incoming_calls ;
    free_data = parse_country[country][day_plan].free_data ;
    free_minutes_India_local = parse_country[country][day_plan].free_minutes_India_local ;
    free_sms = parse_country[country][day_plan].free_sms ;

    response.send({
      'payload': {
        'google': {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Awesome! Finding the best pack for you."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": `I feel great to hear that you're visiting ${country} so the best plan I can offer for your entourage is Rs ${effective_rental} per day for 10 days and Rs 646 for 11th day which cost you ${pack_rental + (646 * rem_days)}  \n This pack includes ${incoming_calls} incoming calls, 3500 MB free data, ${free_minutes_India_local + (100 * rem_days)} free minutes to India or Local and ${free_sms + (100*rem_days)} SMSs with ${validity + (rem_days)} days validity.`
                }
              }
            ],
            "suggestions": [
              {
                "title": "Purchase this pack"
              },
              {
                "title": "exit"
              }
            ]
          }
        }
      }

    });

  } else {
    day_plan = 30;

    pack_rental = parse_country[country][day_plan].pack_rental ;
    effective_rental = parse_country[country][day_plan].effective_rental ;
    validity = parse_country[country][day_plan].validity ;
    incoming_calls = parse_country[country][day_plan].incoming_calls ;
    free_data = parse_country[country][day_plan].free_data ;
    free_minutes_India_local = parse_country[country][day_plan].free_minutes_India_local ;
    free_sms = parse_country[country][day_plan].free_sms ;

    response.send({
      'payload': {
        'google': {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Awesome! Finding the best pack for you."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": `I feel great to hear that you're visiting ${country} so the best plan I can offer for your entourage is Rs ${effective_rental} per day for ${day_plan} days which cost you Rs ${pack_rental}  \n This pack includes ${incoming_calls} incoming calls, ${free_data} free data, ${free_minutes_India_local} free minutes to India or Local and ${free_sms} SMSs with ${validity} days validity.`
                }
              }
            ],
            "suggestions": [
              {
                "title": "Purchase this pack"
              },
              {
                "title": "exit"
              }
            ]
          }
        }
      }

    });
  }


});

// exports.testoddeven = functions.https.onRequest((request, response) => {
//
//   // var full_session_id = request.body.session;
//   // var session = full_session_id.split("/")[4];
//
//   //var session = request.body.originalDetectIntentRequest.payload.user.userId ;
//
//
//   let userStorage = request.body.originalDetectIntentRequest.payload.user.userStorage || JSON.stringify({});
//   let userId;
//   console.log("userStorage", userStorage);
//   userStorage = JSON.parse(userStorage);
//   console.log("userStorage_after_parsing", userStorage);
//
//   if (userStorage.hasOwnProperty('userId')) {
//     userId = userStorage.userId;
//     console.log("userID In if", userId);
//   } else {
//     // Uses the "uuid" package. You can get this with "npm install --save uuid"
//     // var uuid = require('uuid/v4');
//     var uuid = require('uuid/v4');
//     userId = uuid();
//     userStorage.userId = userId
//   }
//
//   console.log("userID", userId);
//
//
//   switch(request.body.queryResult.action) {
//
//     case 'generatenumber' : {
//
//
//       let params = request.body.queryResult.parameters ;
//       let runs = request.body.queryResult.parameters.runs.number ;
//
//       runs = Math.floor(runs);
//       if(runs <= 0 || runs > 6){
//         response.send({
//           'fulfillmentText' : `You can only hit from 1 run to 6 runs.`,
//           'payload': {
//             'google': {
//               'userStorage': JSON.stringify(userStorage)
//             }
//           }
//
//         })
//       } else {
//
//       var ass_run = Math.floor(Math.random() * 6) + 1;
//     //console.log("card outside", card);
//
//       if(ass_run === runs){
//         var card = { };
//         var fields = firestore.collection('game1').doc(userId);
//         fields.get()
//         .then( doc => {
//           if(!doc.exists){
//             console.log('No duch document!');
//             response.send({
//               'fulfillmentText' : `We both hit ${runs} runs. Sorry, You're out on the first ball! \nUnluckily, Your total score is 0 run.  \nWould you like to play again with me?`,
//               'payload': {
//                 'google': {
//                   'userStorage': JSON.stringify(userStorage)
//                 }
//               }
//
//             });
//           } else {
//             card = doc.data();
//             //console.log("doc_data_else", doc.data());
//             //console.log("total_player in card", card['total_player']);
//             var runs_scored = card['total_player'];
//             var max_runs = card['max_runs'];
//
//             card['total_player'] = 0;
//             card['times_played'] += 1;
//             if(runs_scored > max_runs){
//               card['max_runs'] = runs_scored;
//             }
//             //console.log("card after adding times played", card);
//
//             firestore.collection('game1').doc(userId).set(card)
//               .then(() => {
//                 response.send({
//                   'fulfillmentText' : `We both hit ${runs} runs. Sorry, You're out!  \nYour total score is ${runs_scored} runs.  \nWould you like to play again with me?`,
//                   'payload': {
//                     'google': {
//                       'userStorage': JSON.stringify(userStorage)
//                     }
//                   }
//
//                 });
//                 return console.log("max_runs", max_runs);
//               })
//               .catch((e => {
//
//                 console.log('error: ', e);
//
//                 response.send({
//                'fulfillmentText' : `something went wrong when writing to database`,
//                'payload': {
//                  'google': {
//                    'userStorage': JSON.stringify(userStorage)
//                  }
//                }
//                   });
//               }))
//
//           }
//           return console.log("card when runs are equal", card);
//         })
//         .catch((e => {
//           console.log('error from database when runs are equal', e);
//         }));
//
//         // card['total_player'] = 0;
//         // card['times_played'] += 1;
//
//       } else {
//         card = { };
//         card['total_player'] = runs;
//         card['times_played'] = 0;
//         card['max_runs'] = 0;
//         console.log(card);
//
//         fields = firestore.collection('game1').doc(userId);
//         fields.get()
//         .then( doc => {
//             if(!doc.exists){
//               firestore.collection('game1').doc(userId).set(card)
//                 .then(() => {
//                   response.send({
//                     'fulfillmentText' : `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`,
//                     'payload': {
//                       'google': {
//                         'userStorage': JSON.stringify(userStorage)
//                       }
//                     }
//
//                   });
//                   return console.log("total runs in card", card);
//                 })
//                 .catch((e => {
//
//                   console.log('error: ', e);
//
//                   response.send({
//                  'fulfillmentText' : `something went wrong when writing to database`,
//                  'payload': {
//                    'google': {
//                      'userStorage': JSON.stringify(userStorage)
//                    }
//                  }
//
//                     });
//                 }))
//
//
//             } else {
//               card = doc.data();
//               console.log("doc_data_else", doc.data());
//               console.log("total_player in card", card['total_player']);
//               card['total_player'] = card['total_player'] + runs;
//               console.log("card after adding runs", card);
//
//               firestore.collection('game1').doc(userId).set(card)
//                 .then(() => {
//                   response.send({
//                     'fulfillmentText' : `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming.`,
//                     'payload': {
//                       'google': {
//                         'userStorage': JSON.stringify(userStorage)
//                       }
//                     }
//                   });
//                   return console.log("total runs in card when already data is there", card);
//                 })
//                 .catch((e => {
//
//                   console.log('error: ', e);
//
//                   response.send({
//                  'fulfillmentText' : `something went wrong when writing to database`,
//                  'payload': {
//                    'google': {
//                      'userStorage': JSON.stringify(userStorage)
//                    }
//                  }
//
//                     });
//                 }))
//
//             }
//             return console.log("card when runs not equal", card);
//           })
//         .catch((e => {
//           console.log('error from database', e);
//         }));
//
//         }
//       }
//
//
//
//       break;
//     }
//
//     case 'maximumruns' : {
//
//       var player_data = firestore.collection('game1').doc(userId);
//       player_data.get()
//       .then(doc => {
//         if(!doc.exists){
//           console.log('No such document!');
//           response.send({
//             'fulfillmentText' : `You have scored a maximum of 0 run. Would you like to play again?`,
//             'payload': {
//               'google': {
//                 'userStorage': JSON.stringify(userStorage)
//               }
//             }
//
//           });
//         } else {
//           var max_card = doc.data();
//           var max_runs = max_card['max_runs'];
//           var num_plays = max_card['times_played'];
//
//           response.send({
//             'fulfillmentText' : `You have scored a maximum of ${max_runs} runs in ${num_plays} matches.  \n Keep up the good play! Would you like to play again?`,
//             'payload': {
//               'google': {
//                 'userStorage': JSON.stringify(userStorage)
//               }
//             }
//
//           });
//         }
//         return console.log("max_runs", max_runs);
//       })
//       .catch((e => {
//
//         console.log('error: ', e);
//
//         response.send({
//        'fulfillmentText' : `something went wrong when writing to database`,
//        'payload': {
//          'google': {
//            'userStorage': JSON.stringify(userStorage)
//          }
//        }
//
//           });
//       }))
//
//       break;
//     }
//
//     default: {
//
//       response.send({
//         'fulfillmentText' : `no action matched in webhook`,
//         'payload': {
//           'google': {
//             'userStorage': JSON.stringify(userStorage)
//           }
//         }
//
//       });
//
//       break;
//     }
//
//   }
//
// });
