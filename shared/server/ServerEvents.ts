export enum ServerEvents {
  // Game
  gameNavigate = "server.game.navigate",
  updateOverlay = "server.game.updateOverlay",
  gameData = "server.game.gameData",
  gameAbort = "server.game.abort",
  privateGameCreated = "server.game.privateGameCreated",
  privateGameNotCreated = "server.game.privateGameNotCreated",
  gameRefused = "server.game.refused",
}
