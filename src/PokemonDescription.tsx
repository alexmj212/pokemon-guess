import { IPokemon, IPokemonSpecies } from "pokeapi-typescript";
import React, { useEffect, useState } from "react";

type PokemonDescriptionProps = {
  pokemon: IPokemon;
  pokemonSpecies: IPokemonSpecies;
};

const PokemonDescription: React.FC<PokemonDescriptionProps> = ({
  pokemon,
  pokemonSpecies,
}) => {
  const [description, setDescription] = useState<string>();
  useEffect(() => {
    const nameRegEx = new RegExp(pokemonSpecies.name, "ig");
    const flavorEntries = pokemonSpecies.flavor_text_entries
      .filter((entry) => entry.language.name === "en")
      .filter(
        ({ flavor_text }, index) =>
          !flavor_text.includes(flavor_text, index + 1)
      )
      .map((entry) => {
        return {
          ...entry,
          flavor_text: entry.flavor_text.replace(nameRegEx, "<Pokémon Name>"),
        };
      });
    const randomFlavorText = flavorEntries[
      Math.floor(Math.random() * flavorEntries.length)
    ].flavor_text.replace("", " ");
    setDescription(randomFlavorText);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[150px] flex items-center justify-center">
      {description && (
        <div className="flex flex-col">
          <span className="pokedex-description">{description}</span>
          <div className="flex flex-row justify-center py-4 gap-4">
            {pokemon?.types.map((type, index) => {
              return (
                <span
                  key={`${type.type}-${index}`}
                  className={`type-badge ${type.type.name}`}
                >
                  {type.type.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDescription;
