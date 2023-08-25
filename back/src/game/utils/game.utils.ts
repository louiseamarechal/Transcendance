import { Game } from '../classes/Game';

export function getGameByUserId(
  games: Map<string, Game>,
  userId: number,
): Game | null {
  let foundGames: Game[] = [];
  for (const [key, game] of games) {
    console.log({ key });
    if (game.p1.user?.id === userId || game.p2.user?.id === userId) {
      foundGames.push(game);
    }
  }

  console.log(
    `[getGameByUserId] Found ${foundGames.length} game for user #${userId}`,
  );

  if (foundGames.length === 0) {
    return null;
  } else if (foundGames.length === 1) {
    return foundGames[0];
  } else {
    throw '[getGameByUserId] More than 1 game exist for a user';
  }
}
