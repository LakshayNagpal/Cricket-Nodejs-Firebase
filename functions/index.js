const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();
var http = require('http');

const host = 'api.edamam.com';
const recipe_api_id = 'e8297cf8';
const recipe_api_key = '025ece12056c837955ebaa635784ef4a';
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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${cal} calories!
                        You can try increasing the number of calories or verify if the food item is written correctly.`;

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

          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has
                        ${calories} calories for a single serving!  \n It feels good to teach people how to make unique and delicious food :)`;
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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${cal} calories!
                        You can try increasing the number of calories or verify if the food item is written correctly.`;

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

          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this recipe has
                        ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} :(
                        Can you please verify if you have entered the food item correctly or try again with different name.`;

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
          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this
                        recipe has ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} :(
                        Can you please verify if you have entered the food item correctly or try again with different name.`;

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
          let output = `The ingredient list of ${recipe_name} are ${ingredients} and this
                        recipe has ${calories} calories for a single serving!  \nIt feels good to teach people how to make unique and delicious food :)`;
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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${num_of_ingr} ingredients!
                        Please verify if the name of the recipe was entered correctly or else try again with some different recipe.`;

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

          let output = `The ingredient list of ${recipe_name} Recipe are ${ingredients} and this recipe has
                        ${calories} calories with daily nutrition value of ${nutrition}% which will serve ${servings} people !  \nIt feels good to teach people how to make unique and delicious food :)`;

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
          let output = `Sorry, I couldn't find recipe for ${asked_recipe} with ${num_of_ingr} ingredients!
                        Please verify if the name of the recipe was entered correctly or else try again with some different recipe.`;

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

          let output = `The ingredient list of ${recipe_name} Recipe are ${ingredients} and this recipe has
                        ${calories} calories with daily nutrition value of ${nutrition}% which will serve ${servings} people !  \nIt feels good to teach people how to make unique and delicious food :)`;

          resolve(output);

        }

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
  console.log("userStorage", userStorage);
  userStorage = JSON.parse(userStorage);
  console.log("userStorage_after_parsing", userStorage);

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


  switch(request.body.queryResult.action) {

    case 'generatenumber' : {


      let params = request.body.queryResult.parameters ;
      let runs = request.body.queryResult.parameters.runs.number ;

      runs = Math.floor(runs);
      if(runs <= 0 || runs > 6){
        response.send({
          'fulfillmentText' : `You can only hit from 1 run to 6 runs.`,
          'payload': {
            'google': {
              'userStorage': JSON.stringify(userStorage)
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
              'fulfillmentText' : `We both hit ${runs} runs. Sorry, You're out on the first ball! \nUnluckily, Your total score is 0 run.  \nWould you like to play again with me?`,
              'payload': {
                'google': {
                  'userStorage': JSON.stringify(userStorage)
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
                  'fulfillmentText' : `We both hit ${runs} runs. Sorry, You're out!  \nYour total score is ${runs_scored} runs.  \nWould you like to play again with me?`,
                  'payload': {
                    'google': {
                      'userStorage': JSON.stringify(userStorage)
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
        fields = firestore.collection('game').doc(userId);
        fields.get()
        .then( doc => {
            if(!doc.exists){
              firestore.collection('game').doc(userId).set(card)
                .then(() => {
                  response.send({
                    'fulfillmentText' : `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`,
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage)
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
                    'fulfillmentText' : `I hit ${ass_run} runs. You hit ${runs} runs. Great! Hit the next incoming ball.`,
                    'payload': {
                      'google': {
                        'userStorage': JSON.stringify(userStorage)
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

            }
            return console.log("card when runs are not equal", card);
          })
        .catch((e => {
          console.log('error from database', e);
        }));

        // calloddeven().then((output) => {
        //   card = output;
        //   return console.log("card value after function returns", card);
        // }).catch(() => {
        //   console.log("function calloddeven not called properly" );
        // })
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
            'fulfillmentText' : `You have scored a maximum of 0 run. Would you like to play again?`,
            'payload': {
              'google': {
                'userStorage': JSON.stringify(userStorage)
              }
            }
          });
        } else {
          var max_card = doc.data();
          var max_runs = max_card['max_runs'];
          var num_plays = max_card['times_played'];

          response.send({
            'fulfillmentText' : `You have scored a maximum of ${max_runs} runs in ${num_plays} matches. Keep up the good play!  \nWould you like to challenge me again?`,
            'payload': {
              'google': {
                'userStorage': JSON.stringify(userStorage)
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



          // firestore.collection('users').get()
          //   .then((snapshot) => {
          //
          //     var feedbacks = [];
          //     snapshot.forEach((doc) => { feedbacks.push(doc.data())});
          //
          //     var feedback_count = `you have given ${feedbacks.length} feedbacks to us. \n
          //                           Do you want to see all your feedbacks?`;
          //
          //     response.send({
          //       'fulfillmentText' : feedback_count
          //     });
          //     return console.log("showfeedbacks", feedback_count);
          //   })
          //   .catch((err) => {
          //     console.log("error getting document", err);
          //
          //     response.send({
          //       'fulfillmentText' : `something went wrong while reading from the database`
          //     })
          //   })

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
