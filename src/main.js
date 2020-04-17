import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'

const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 600,
  input: {
    gamepad: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [IntroScene],
}
window.game = new Phaser.Game(config)

export default window.game
