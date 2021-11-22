import './App.css';
import { useState, useEffect } from 'react';


function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const pokemonArray = []; // working on array for saving pokemon
    const [tableContent, setTableContent] = useState([]);
    const typesSet = new Set(); // working on set for saving occurding pokemon types
    const [types, setTypes] = useState([]);

    const pokeBaseUrl = "https://pokeapi.co/api/v2/pokemon/";


    function fetchPokeData(count, max) {
        if (count > max) {
            setTableContent(pokemonArray);
            setTypes(Array.from(typesSet));
            return; // stop if max=n pokemon are fetched
        }
        fetch(pokeBaseUrl + count.toString())
            .then(res => res.json())
            .then(
                (result) => {
                    pokemonArray.push(result); // save current pokemon
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



    // initialize
    useEffect(() => {
        fetchPokeData(1, 150);
        setIsLoaded(true);
    }, [])


    // error handling
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    };


  return (
    <div className="App">
          <header className="App-header">
              <h1>Pokedex</h1>

              <div className="Filter">
                  {/*insert all types*/}
                  {types.map((type) =>
                      <label key={type} htmlFor={type}>
                          <input type="checkbox" id={type} />
                          {type}
                      </label>
                      )}
              </div>

              <div className="Catalog">
                  <table>
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
                                  <td className="pPic"><img src={pokemon.sprites.front_default} alt={pokemon.name} /></td>
                                  <td className="pName">{pokemon.name}</td>
                              </tr>
                          )}
                      </tbody>  
                  </table>
              </div>

          </header>
    </div>
    );
}


export default App;
