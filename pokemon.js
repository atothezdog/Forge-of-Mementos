function getEvolutionOptions() {
  const hand = cards?.Hand ?? [];
  const active = cards?.Active ?? [];
  const bench = cards?.Bench ?? [];

  const targets = [...active, ...bench];

  const options = [];

  for (const evolutionCard of hand) {
    const evolutionData = functions.getCardData(evolutionCard);

    if (!evolutionData?.evolvesFrom) continue;

    for (const targetCard of targets) {
      const targetData = functions.getCardData(targetCard);

      if (!targetData) continue;

      if (targetData.name !== evolutionData.evolvesFrom) continue;

      options.push({
        evolutionId: evolutionCard.id,
        evolutionName: evolutionData.name,
        targetId: targetCard.id,
        targetName: targetData.name,
        targetZone: active.includes(targetCard) ? "Active" : "Bench"
      });
    }
  }

  return options;
}


function refreshEvolutionOptions() {
  game.data.Evolution.options = getEvolutionOptions();
}


async function evolve(evolutionId, targetId, targetZone) {
  const hand = cards?.Hand ?? [];
  const active = cards?.Active ?? [];
  const bench = cards?.Bench ?? [];

  const evolutionCard = hand.find(card => card.id === evolutionId);

  const targetCard =
    active.find(card => card.id === targetId) ??
    bench.find(card => card.id === targetId);

  if (!evolutionCard || !targetCard) {
    return;
  }

  const evolutionData = functions.getCardData(evolutionCard);
  const targetData = functions.getCardData(targetCard);

  if (!evolutionData?.evolvesFrom) {
    return;
  }

  if (targetData?.name !== evolutionData.evolvesFrom) {
    return;
  }

  // Put the Pokémon being evolved into the discard pile.
  await functions.moveCard(targetCard, "Discard");

  // Put the evolution into the same position.
  await functions.moveCard(evolutionCard, targetZone);

  functions.chatLog(
    targetData.name + " evolved into " + evolutionData.name + "!"
  );

  refreshEvolutionOptions();
}