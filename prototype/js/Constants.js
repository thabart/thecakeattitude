var Constants = {
  Layers : {
    Ground : {
      Name: "Ground",
      Position: {
        Row: 1,
        Col: 1
      }
    },
    Wall: {
      Name: "Walls",
      Position: {
        Row: 4,
        Col: 0
      }
    },
    Entry: {
      Name: "EntryEntity"
    }
  },
  Selectors: {
    Furniture : "furniture",
    Wall: "wall",
    Floor: "floor"
  },
  playerZIndex: 7,
  sessionName: "shopingame-game",
  apiUrl: 'http://localhost:5000',
  apiConfigurationUrl: 'http://localhost:5000/.well-known/configuration',
  openIdUrl: "http://localhost:5001",
  userClaims : 'http://localhost:5001/users/claims',
  callbackUrl: "http://localhost:3002/callback",
  socketServer: 'http://localhost:3005',
  clientId : "game"
};
