const fs = require('fs');

const boxes = [
  { id: "core", name: "Core Set", image: "Core+Set.jpg" },
  { id: "core_2nd", name: "Core Set (2nd Edition)", image: "Core+Set+2nd+Edition+Box+Art.PNG" },
  { id: "dark_city", name: "Dark City", image: "Dark+City.jpg" },
  { id: "fantastic_four", name: "Fantastic Four", image: "Fantastic+Four.jpg" },
  { id: "paint_the_town_red", name: "Paint the Town Red", image: "Paint+the+Town+Red.jpg" },
  { id: "villains", name: "Villains", image: "Villains.jpg" },
  { id: "guardians", name: "Guardians of the Galaxy", image: "Guardians+of+the+Galaxy.jpg" },
  { id: "fear_itself", name: "Fear Itself", image: "Fear+Itself.jpg" },
  { id: "secret_wars_1", name: "Secret Wars, Vol 1", image: "Secret+Wars+Vol+1.jpg" },
  { id: "secret_wars_2", name: "Secret Wars, Vol 2", image: "Secret+Wars+Vol+2.jpg" },
  { id: "cap_75", name: "Captain America 75th", image: "Captain+America+75.jpg" },
  { id: "civil_war", name: "Civil War", image: "Civil+War.jpg" },
  { id: "deadpool", name: "Deadpool", image: "Deadpool.jpg" },
  { id: "noir", name: "Noir", image: "Noir.jpg" },
  { id: "xmen", name: "X-Men", image: "X-Men.jpg" },
  { id: "spiderman_homecoming", name: "Spider-Man Homecoming", image: "MCU+Spiderman+Homecoming.jpg" },
  { id: "champions", name: "Champions", image: "Champions.jpg" },
  { id: "world_war_hulk", name: "World War Hulk", image: "World+War+Hulk.jpg" },
  { id: "phase_1", name: "Marvel Studios Phase 1", image: "MCU+Phase+1.jpg" },
  { id: "ant_man", name: "Ant-Man", image: "Ant-Man.jpg" },
  { id: "venom", name: "Venom", image: "Venom.jpg" },
  { id: "dimensions", name: "Dimensions", image: "Dimensions.jpg" },
  { id: "revelations", name: "Revelations", image: "Revelations.jpg" },
  { id: "shield", name: "S.H.I.E.L.D.", image: "SHIELD.jpg" },
  { id: "heroes_of_asgard", name: "Heroes of Asgard", image: "Heroes+of+Asgard.jpg" },
  { id: "new_mutants", name: "The New Mutants", image: "New+Mutants.jpg" },
  { id: "into_the_cosmos", name: "Into the Cosmos", image: "Into+the+Cosmos.jpg" },
  { id: "realm_of_kings", name: "Realm of Kings", image: "Realm+of+Kings.jpg" },
  { id: "annihilation", name: "Annihilation", image: "Annihilation.jpg" },
  { id: "messiah_complex", name: "Messiah Complex", image: "Messiah+Complex.jpg" },
  { id: "doctor_strange", name: "Doctor Strange", image: "Doctor+Strange.jpg" },
  { id: "mcu_guardians", name: "MCU Guardians of the Galaxy", image: "MCU+Guardians+of+the+Galaxy.jpg" },
  { id: "black_panther", name: "Black Panther", image: "Black+Panther.jpg" },
  { id: "black_widow", name: "Black Widow", image: "Black+Widow.jpg" },
  { id: "infinity_saga", name: "The Infinity Saga", image: "MCU+Infinity+Saga.jpg" },
  { id: "midnight_sons", name: "Midnight Sons", image: "Midnight+Sons.jpg" },
  { id: "ant_man_wasp", name: "Ant-Man & Wasp", image: "ant-man+and+the+wasp+ad.png" },
  { id: "2099", name: "2099", image: "box-legendary2099+jpeg.jpg" },
  { id: "weapon_x", name: "Weapon X", image: "weapon+x+box.jpg" },
  { id: "what_if", name: "What If...?", image: "What+If+available+now.jpg" }
];

const cardsFile = 'src/data/cards.json';
const data = JSON.parse(fs.readFileSync(cardsFile, 'utf8'));

data.expansions = boxes;

fs.writeFileSync(cardsFile, JSON.stringify(data, null, 2));
console.log('Added ' + boxes.length + ' expansions to cards.json in Release Order');
