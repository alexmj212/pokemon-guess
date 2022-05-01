import "./App.css";
import PokeAPI, {
  INamedApiResource,
  IPokemon,
  IPokemonSpecies,
} from "pokeapi-typescript";
import { useEffect, useState } from "react";
import PokemonDescription from "./PokemonDescription";

const App = () => {
  const [pokemonList, setPokemonList] = useState<
    INamedApiResource<IPokemonSpecies>[]
  >([]);
  const [randomPokemonSpecies, setRandomPokemonSpecies] =
    useState<IPokemonSpecies>();
  const [randomPokemon, setRandomPokemon] = useState<IPokemon>();

  const [showPokemon, setShowPokemon] = useState<boolean>(false);

  const generateRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    PokeAPI.PokemonSpecies.listAll().then((pokemon) => {
      setPokemonList(pokemon.results);
    });
  }, []); // eslint-disable react-hooks/exhaustive-deps

  const genRandomPokemon = () => {
    const ran = generateRandomNumber(pokemonList.length);
    PokeAPI.PokemonSpecies.resolve(pokemonList[ran].name).then(
      (pokemonSpecies) => {
        setRandomPokemonSpecies(pokemonSpecies);
        PokeAPI.Pokemon.resolve(pokemonSpecies.id).then((pokemon) => {
          setRandomPokemon(pokemon);
        });
      }
    );
  };

  useEffect(() => {
    if (pokemonList.length > 0) {
      genRandomPokemon();
    }
  }, [pokemonList]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    genRandomPokemon();
    setShowPokemon(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center w-full h-full max-w-4xl mx-auto py-2 px-2 sm:px-4">
        <h1 className="text-center text-4xl font-bold py-8">{`Who's that Pokémon?`}</h1>
        {randomPokemon && randomPokemonSpecies && (
          <>
            <PokemonDescription
              key={randomPokemon.name}
              pokemon={randomPokemon}
              pokemonSpecies={randomPokemonSpecies}
            />

            <div className="text-center h-[200px] flex flex-col justify-center items-center">
              {showPokemon &&
              randomPokemon &&
              randomPokemon.sprites &&
              randomPokemon.sprites.front_default ? (
                <>
                  <div className="text-4xl font-bold capitalize">
                    {randomPokemon.name}
                  </div>
                  <img
                    src={randomPokemon.sprites.front_default}
                    alt={randomPokemon.name}
                  />
                </>
              ) : (
                <div className="text-4xl font-bold text-slate-500">???</div>
              )}
            </div>
            <div className="h-48 flex flex-col items-center">
              <button
                disabled={showPokemon}
                className="button-positive"
                onClick={() => setShowPokemon(true)}
              >
                Reveal Pokemon
              </button>
              {showPokemon && (
                <button
                  disabled={!randomPokemon}
                  className="button-outline"
                  onClick={reset}
                >
                  Try Another
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
