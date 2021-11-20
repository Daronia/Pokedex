import './App.css';
import { useEffect, useState } from 'react';


function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]); // handling pokemon json
    const [count, setCount] = useState(1); // id of pokemon which is shown

    const pokeBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

    // fetch poke data
    useEffect(() => {
        fetch(pokeBaseUrl + count.toString())
            .then(res => res.json())
            .then(
                (result) => {
                    setItems(result);
                    setIsLoaded(true);
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                }            )
    }, [count]) // only re-run effect if count changes

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    };


  return (
    <div className="App">
          <header className="App-header">
              <h1>Pokedex</h1>

              <div className="Catalog">
                  <button onClick={() => {
                      if (count > 1) setCount(count - 1);
                  }
                  }>Previous</button>
                  <button onClick={() => {
                      if (count < 150) setCount(count + 1);
                  }
                  }>Next</button>
                  <table>
                      <thead>
                          <tr>
                              <th>Picture</th>
                              <th>Name</th>
                              <th>Number</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td id="pic"><img src={items.sprites.front_default} alt={items.name} /></td>
                              <td id="name">{items.name}</td>
                              <td id="number">{items.id}</td>
                          </tr>
                      </tbody>  
                  </table>
              </div>

          </header>
    </div>
    );
}


export default App;
