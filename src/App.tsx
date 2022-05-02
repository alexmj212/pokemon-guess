import "./App.css";
import PokeAPI, {
  INamedApiResource,
  IPokemon,
  IPokemonSpecies,
} from "pokeapi-typescript";
import { useEffect, useState } from "react";
import PokemonDescription from "./PokemonDescription";
import ReactGA from "react-ga4";

const App = () => {
  const [pokemonList, setPokemonList] = useState<
    INamedApiResource<IPokemonSpecies>[]
  >([]);
  const [randomPokemonSpecies, setRandomPokemonSpecies] =
    useState<IPokemonSpecies>();
  const [randomPokemon, setRandomPokemon] = useState<IPokemon>();

  const [showPokemon, setShowPokemon] = useState<boolean>(false);

  const [buildVersion, setBuildVersion] = useState<string>();

  const generateRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    PokeAPI.PokemonSpecies.listAll().then((pokemon) => {
      setPokemonList(pokemon.results);
    });
    const ver =
      document
        .querySelector('meta[name="build-version"]')
        ?.getAttribute("build-version") || "";
    setBuildVersion(ver);
    ReactGA.initialize("G-5RHHK32PFX", {
      gaOptions: {
        build: ver,
      },
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
      <div className="flex flex-col w-full h-full max-w-xl mx-auto py-2 px-2 sm:px-4">
        <div>
          <h1 className="page-title">{`Who's that PoKéMoN?`}</h1>
          {randomPokemon && randomPokemonSpecies && (
            <>
              <PokemonDescription
                key={randomPokemon.name}
                pokemon={randomPokemon}
                pokemonSpecies={randomPokemonSpecies}
              />

              <div className="text-center min-h-[250px] md:min-h-[450px] flex flex-col justify-center items-center">
                {showPokemon &&
                randomPokemon &&
                randomPokemon.sprites &&
                randomPokemon.sprites.front_default ? (
                  <>
                    <div className="text-4xl font-bold capitalize">
                      {
                        randomPokemonSpecies.names.filter(
                          (entry) => entry.language.name === "en"
                        )[0].name
                      }
                    </div>
                    <img
                      className="pokemon-sprite"
                      src={
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        randomPokemon.sprites["other"]["official-artwork"][
                          "front_default"
                        ] ?? randomPokemon.sprites.front_default
                      }
                      alt={randomPokemon.name}
                    />
                  </>
                ) : (
                  <div className="text-8xl font-bold text-slate-500">???</div>
                )}
              </div>
              <div className="flex flex-col items-center">
                {showPokemon ? (
                  <button className="button-outline" onClick={reset}>
                    Try Another
                  </button>
                ) : (
                  <button
                    className="button-positive"
                    onClick={() => setShowPokemon(true)}
                  >
                    Reveal Pokemon
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-initial flex-wrap flex-row justify-between border-t-2 border-slate-300 dark:border-slate-500 mt-4 py-4 text-xs">
          <div className="flex flex-auto flex-row space-x-4">
            <a href="https://alexmj212.dev" className="underline">
              alexmj212.dev
            </a>
          </div>
          <div className="flex flex-auto flex-row space-x-4 justify-end items-end">
            <span id="build">Build: {buildVersion}</span>
            <a className="underline" href="https://pokeapi.co/">
              Data Provided by PokeApi
            </a>
            <a
              href="https://www.github.com/alexmj212/pokemon-guess"
              className="underline"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
