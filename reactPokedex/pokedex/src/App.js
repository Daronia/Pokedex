import { useState, useEffect } from 'react';


function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const pokemonSet = new Set(); // working on set for saving pokemon
    const [allPokemon, setAllPokemon] = useState([]);
    const typesSet = new Set(); // working on set for saving occurring pokemon types
    const [types, setTypes] = useState([]);
    const [tableContent, setTableContent] = useState([]);

    const pokeBaseUrl = "https://pokeapi.co/api/v2/pokemon/";


    function fetchPokeData(count, max) {
        if (count > max) {
            setAllPokemon(Array.from(pokemonSet));
            setTableContent(Array.from(pokemonSet));
            setTypes(Array.from(typesSet));
            return; // stop if max=n pokemon are fetched
        }
        fetch(pokeBaseUrl + count.toString())
            .then(res => res.json())
            .then(
                (result) => {
                    pokemonSet.add(result); // save current pokemon
                    for (let type of result.types) { // save all types that occure in pokemon fetched
                        typesSet.add(type.type.name);
                    }
                    fetchPokeData(count + 1, max); // recursive
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                })
    }



    function filterTypes() {
        let checkboxes = document.getElementsByClassName("typeFilter");
        let checked = new Set(); // checked checkboxes
        let withType = new Set(); // pokemons that have all types
        let howManyHits = {}; // how many types equal from checked per pokemon

        for (let c of checkboxes) { if (c.checked) checked.add(c); }

        if (checked.size === 0) { // no filter needed
            setTableContent(allPokemon);
            return;
        }
        
        for (let pokemon of allPokemon) { // look at each pokemon
            howManyHits[pokemon] = 0;
            for (let type of pokemon.types) { // go through all types the pokemon have (max 2)
                for (let c of checked) {
                    if (type.type.name === c.id) {
                        howManyHits[pokemon] = howManyHits[pokemon] + 1;
                        // if all types are found in pokemon -> add to table
                        if (howManyHits[pokemon] === checked.size) withType.add(pokemon);
                    }
                }    
            }
        }

        setTableContent(Array.from(withType));
    }



    // initialize
    useEffect(() => {
        fetchPokeData(1, 150);
        setIsLoaded(true);
    }, [])


    // error handling
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    };


  return (
    <div className="App">
          <header className="App-header">
              <div className="container">
                  <div className="row g-2">
                      <h1 className="display-1">Pokedex</h1>

                      <div className="col-9">
                          <div className="Catalog">
                              <div class="table-responsive">
                                  <table className="table table-striped table-hover table-sm align-middle">

                                      <thead>
                                          <tr>
                                              <th>Number</th>
                                              <th>Picture</th>
                                              <th>Name</th>
                                          </tr>
                                      </thead>

                                      <tbody id="pokedexContent">
                                          {/*insert rows*/}
                                          {tableContent.map((pokemon) =>
                                              <tr key={pokemon.id}>
                                                  <td className="pId">{pokemon.id}</td>
                                                  <td className="pPic"><img src={pokemon.sprites.front_default} className="img-fluid" alt={pokemon.name} /></td>
                                                  <td className="pName">{pokemon.name}</td>
                                              </tr>
                                          )}
                                      </tbody>

                                  </table>
                              </div>
                          </div>
                      </div>

                      <div className="col-3">
                          <div className="Filter">
                              <div className="row">
                                  <div className="row">
                                      {/*insert all types*/}
                                      {types.map((type) =>
                                          <label key={type} htmlFor={type}>
                                              <input type="checkbox" id={type} className="typeFilter" onChange={filterTypes} />
                                              {" " + type}
                                          </label>
                                          )}
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          </header>
    </div>
    );
}


export default App;
