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
        Row: 0,
        Col: 0
      }
    }
  },
  Selectors: {
    Furniture : "furniture",
    Wall: "wall",
    Floor: "floor"
  },
  Interactions: {
    Shelf: "Shelf"
  },
  playerZIndex: 7,
  sessionName: "shopingame-game",
  openIdUrl: "http://localhost:5001",
  userClaims : 'http://localhost:5001/users/claims',
  callbackUrl: "http://localhost:3002/callback",
  clientId : "game"
};
