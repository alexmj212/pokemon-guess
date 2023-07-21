import { Pokemon, PokemonSpecies } from "pokenode-ts";
import React, { useEffect, useState } from "react";

type PokemonDescriptionProps = {
  pokemon: Pokemon;
  pokemonSpecies: PokemonSpecies;
};

const PokemonDescription: React.FC<PokemonDescriptionProps> = ({
  pokemon,
  pokemonSpecies,
}) => {
  const [description, setDescription] = useState<string>();
  useEffect(() => {
    const nameRegEx = new RegExp(pokemonSpecies.name, "ig");
    try {
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
    } catch {
      setDescription("There isn't enough information about this Pokémon.");
    }
  }, [pokemon, pokemonSpecies]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[150px] flex items-center justify-center">
      {description && (
        <div className="flex flex-col">
          <span className="pokedex-description">{description}</span>
          <div className="pokedex-description flex flex-row justify-center py-4 gap-4">
            First Appearance:{" "}
            <div className="uppercase">
              Gen {pokemonSpecies?.generation?.name.split("-")[1]}
            </div>
          </div>
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
