/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { useEffect, useState } from "react";
import {
  MainClient,
  NamedAPIResource,
  Pokemon,
  PokemonSpecies,
} from "pokenode-ts";
import PokemonDescription from "./PokemonDescription";
import ReactGA from "react-ga4";

const App = () => {
  const [generationList, setGenerationList] = useState<NamedAPIResource[]>([]);
  const [generationFilters, setGenerationFilters] = useState<number[]>([]);

  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies>();

  const [showPokemon, setShowPokemon] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [buildVersion, setBuildVersion] = useState<string>();

  const PokeAPI = new MainClient();

  const generateRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max) + 1;
  };

  const getGenerationList = () => {
    PokeAPI.game.listGenerations().then((generation) => {
      setGenerationList(generation.results);
      setGenerationFilters(generation.results.map((gen, index) => index + 1));
    });
  };

  const getRandomGenerationSpecies = (filterList: number[]) => {
    const randomGen = generateRandomNumber(filterList.length);
    PokeAPI.game
      .getGenerationById(randomGen)
      .then((generation) => {
        getRandomSpecies(generation.pokemon_species);
      })
      .catch((e) => {
        console.error("Unable to get Generation", randomGen, e);
      });
  };

  const getRandomSpecies = (speciesList: NamedAPIResource[]) => {
    const randomSpecies = speciesList[generateRandomNumber(speciesList.length)];
    if (randomSpecies && "name" in randomSpecies) {
    PokeAPI.pokemon
      .getPokemonSpeciesByName(randomSpecies.name)
      .then((species) => {
        setPokemonSpecies(species);
        return species;
      })
      .then((species) => {
        PokeAPI.pokemon.getPokemonById(species.id).then((pokemon) => {
          setPokemon(pokemon);
        });
      })
      .finally(() => setTimeout(() => setLoading(false), 1000))
      .catch((e) => {
        console.error("Unable to get random species", randomSpecies, e);
      });
    } else {
      throw "Unable to get random pokemon";
    }
  };

  const initializeGame = () => {
    setLoading(true);
    getGenerationList();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (generationList.length > 0 && generationFilters.length > 0) {
      getRandomGenerationSpecies(generationFilters);
    }
  }, [generationList, generationFilters]);

  useEffect(() => {
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

  const reset = () => {
    setLoading(true);
    getRandomGenerationSpecies(generationFilters);
    setPokemon({} as any);
    setPokemonSpecies({} as any);
    setShowPokemon(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full max-w-4xl mx-auto py-2 px-2 sm:px-4">
        <div className="main-frame">
          <h1 className="page-title">{`Who's that PoKéMoN?`}</h1>
          {loading && (
            <div className="flex w-full h-[500px] justify-center items-center m-auto pokedex-description align-center">
              {" "}
              <div className="poke_box">
                <div className="pokeball" onClick={() => setShowPokemon(true)}>
                  <div className="pokeball__button"></div>
                </div>
              </div>
            </div>
          )}
          {!loading && pokemon && pokemonSpecies && (
            <div className="flex flex-col-reverse sm:flex-row h-[500px]">
              <div className="pokemon-box">
                <div className="text-center min-h-[250px] md:min-h-[450px] flex flex-col justify-center items-center">
                  {
                  pokemon &&
                  pokemon.sprites &&
                  pokemon.sprites.front_default ? (
                    <>
                      <div className="pokemon-name text-4xl font-bold capitalize">
                        {
                          showPokemon ? pokemonSpecies.names.filter(
                            (entry) => entry.language.name === "en"
                          )[0].name : '???'
                        }
                      </div>
                      <img
                        className={`pokemon-sprite ${showPokemon ? '' : 'hidden-pokemon'}`}
                        src={
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          pokemon.sprites["other"]["official-artwork"][
                            "front_default"
                          ] ?? pokemon.sprites.front_default
                        }
                        alt={pokemon.name}
                      />
                    </>
                  ) : (
                    <div className="poke_box">
                      <div
                        className="pokeball"
                        onClick={() => setShowPokemon(true)}
                      >
                        <div className="pokeball__button"></div>
                      </div>
                    </div>
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
                      onClick={() => {
                        const audio = new Audio('./chime.mp3');
                        audio.play();
                        setShowPokemon(true)
                      }}
                    >
                      Reveal Pokemon
                    </button>
                  )}
                </div>
              </div>
              <PokemonDescription
                key={pokemon.name}
                pokemon={pokemon}
                pokemonSpecies={pokemonSpecies}
              />
            </div>
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
