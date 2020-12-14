import test from './test';
import router from './router';
import gamePlay from './gamePlay';
import game from './game';
import user from './user';

export default {
  page: router,
  test,
  gamePlay,
  user: user.reducer,
  game: game.reducer,
};
