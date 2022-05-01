import {
  IPokemon,
  IPokemonSpecies,
} from "pokeapi-typescript";
import React, { useEffect, useState } from "react";

type PokemonDescriptionProps = {
  pokemon: IPokemon;
  pokemonSpecies: IPokemonSpecies;
};

const PokemonDescription: React.FC<PokemonDescriptionProps> = ({ pokemonSpecies }) => {
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
            flavor_text: entry.flavor_text.replace(nameRegEx, "it"),
          };
        });
      const randomFlavorText = flavorEntries[
        Math.floor(Math.random() * flavorEntries.length)
      ].flavor_text.replace("", "");
      setDescription(randomFlavorText);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-24 flex items-center justify-center">
      {description && <span className="text-2xl text-center capitalize">{description}</span>}
    </div>
  );
};

export default PokemonDescription;
