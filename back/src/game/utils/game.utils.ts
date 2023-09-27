import { Game, GameVisibility } from '../classes/Game';

/**
 * @returns An array of Game
 */
export function getGameByUserId(
  games: Map<string, Game>,
  userId: number,
): Game[] {
  let foundGames: Game[] = [];
  for (const [_, game] of games) {
    if (game.p1.user?.id === userId || game.p2.user?.id === userId) {
      foundGames.push(game);
    }
  }

  console.log(
    `[getGameByUserId] Found ${foundGames.length} game for user #${userId}`,
  );

  return foundGames;
}

export function getPublicGameByUserId(
  games: Map<string, Game>,
  userId: number,
): Game[] {
  let foundGames: Game[] = [];
  for (const [_, game] of games) {
    if (
      game.visibility === GameVisibility.Public &&
      (game.p1.user?.id === userId || game.p2.user?.id === userId)
    ) {
      foundGames.push(game);
    }
  }

  console.log(
    `[getPublicGameByUserId] Found ${foundGames.length} game for user #${userId}`,
  );

  return foundGames;
}
