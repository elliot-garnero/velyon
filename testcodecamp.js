  // Setup
var collection = {
    "2548": {
      "album": "Slippery When Wet",
      "artist": "Bon Jovi",
      "tracks": [ 
        "Let It Rock", 
        "You Give Love a Bad Name" 
      ]
    },
    "2468": {
      "album": "1999",
      "artist": "Prince",
      "tracks": [ 
        "1999", 
        "Little Red Corvette" 
      ]
    },
    "1245": {
      "artist": "Robert Palmer",
      "tracks": [ ]
    },
    "5439": {
      "album": "ABBA Gold"
    }
};
// Keep a copy of the collection for tests
var collectionCopy = JSON.parse(JSON.stringify(collection));

// Only change code below this line
function updateRecords(id, prop, value) {     //défini la fonction et ses arguments
  if (prop === "tracks" && value !== "") {    //condition si prop est "tracks" ET value pas blank 
   if(collection[id][prop]) {               //=>condition *inception* si il y a un 1er et 2e élément dans collection
    collection[id][prop].push(value);         // push (value) dans le tableau après [id][prop]
   }
   else {                                     //else *inception* si ya pas de id et prop
    collection[id][prop]=[value];             //sinon(crée le tableau avec value)
   }
  } 
  else if (value !== "") {                    //else n°1 si value n'est pas blank
    collection[id][prop] = value;             //la collection a pour parametre ce qui est stocké dans value
  } 
  else {
    delete collection[id][prop];              //enfin (donc si value est blank) supprimer l'élément de l'objet
  }

  return collection;
}

// Alter values below to test your code
updateRecords(5439, "artist", "ABBA");
