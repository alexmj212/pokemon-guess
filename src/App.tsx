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
  const [randomPokemon, setRandomPokemon] =
    useState<INamedApiResource<IPokemonSpecies>>();
  const [randomId, setRandomId] = useState<number>(0);

  const [revealedPokemon, setRevealedPokemon] = useState<IPokemon>();

  const [showPokemon, setShowPokemon] = useState<boolean>(false);

  const generateRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    PokeAPI.PokemonSpecies.listAll(true).then((pokemon) => {
      setPokemonList(pokemon.results);
    });
  }, []);

  useEffect(() => {
    if (pokemonList.length > 0) {
      setRandomId(generateRandomNumber(pokemonList.length));
    }
  }, [pokemonList]);

  useEffect(() => {
    if (randomId && pokemonList.length > 0) {
      setRandomPokemon(pokemonList[randomId]);
    }
  }, [pokemonList, randomId]);

  const reset = () => {
    setRandomId(generateRandomNumber(pokemonList.length));
    setShowPokemon(false);
    setRevealedPokemon({} as IPokemon);
  };

  const revealPokemon = (name: string) => {
    setShowPokemon(true);
    PokeAPI.Pokemon.resolve(name).then((pokemon) => {
      setRevealedPokemon(pokemon);
    });
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center w-full h-full max-w-4xl mx-auto py-2 px-2 sm:px-4">
        <h1 className="text-center text-4xl font-bold py-8">{`Who's that Pokémon?`}</h1>
        {randomPokemon && (
          <>
            <PokemonDescription
              key={randomPokemon.name}
              pokemon={randomPokemon}
            />

            <div className="text-center h-[200px] flex flex-col justify-center items-center">
              {showPokemon &&
              revealedPokemon &&
              revealedPokemon.sprites &&
              revealedPokemon.sprites.front_default ? (
                <>
                  <div className="text-4xl font-bold capitalize">
                    {revealedPokemon.name}
                  </div>
                  <img
                    src={revealedPokemon.sprites.front_default}
                    alt={revealedPokemon.name}
                  />
                </>
              ) : (
                <div className="text-4xl font-bold text-slate-500">???</div>
              )}
            </div>
            <div className="flex justify-center">
              {" "}
              <button
                disabled={showPokemon}
                className="button-positive"
                onClick={() => revealPokemon(randomPokemon?.name)}
              >
                Reveal Pokemon
              </button>
              <button className="button-outline" onClick={reset}>
                Try Another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
