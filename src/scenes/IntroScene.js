import Phaser from 'phaser'
import Align from '../utils/align'

const PLAYER_KEY = 'player'
const TAXI_KEY = 'taxi'
const TRUCK_KEY = 'truck'

const LANES = [220, 360, 490, 600]
let loop = 0
export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('intro')
    this.taxis = []
    this.trucks = []
  }

  preload() {
    this.load.image('background', 'assets/images/backgrounds/background-1.png')
    this.load.image(PLAYER_KEY, 'assets/images/entities/Car.png')
    this.load.image(TAXI_KEY, 'assets/images/entities/taxi.png')
    this.load.image(TRUCK_KEY, 'assets/images/entities/truck.png')
  }

  playerHit(player, enemy) {
    this.taxis = this.taxis.reduce((prev, current) => {
      console.log('current', current)
      if (current === enemy) {
        return prev
      }
      prev.push(current)
      return prev
    }, [])
    enemy.destroy()
    player.setVelocity(0, 0)
    player.setX(player.x - 50)
  }

  create() {
    this.bg = this.add.tileSprite(
      0,
      0,
      game.config.width,
      game.config.height,
      'background'
    )
    Align.center(this.bg)

    this.player = this.physics.add.sprite(595, 350, PLAYER_KEY)
    this.player.setScale(0.7, 0.7)
    this.player.setSize(34, 48, true)

    this.player.setCollideWorldBounds(true)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  addTaxi() {
    const lane = Phaser.Math.Between(0, 3)
    console.info('lane', lane)
    const taxi = this.physics.add.sprite(LANES[lane], -200, TAXI_KEY)
    taxi.setScale(0.7, 0.7)

    this.physics.add.collider(this.player, taxi, this.playerHit, null, this)

    this.taxis.push(taxi)
  }

  addTruck() {
    const lane = Phaser.Math.Between(0, 3)
    console.info('lane', lane)
    const truck = this.physics.add.sprite(LANES[lane], -200, TRUCK_KEY)
    truck.setScale(0.7, 0.7)

    this.physics.add.collider(this.player, truck, () => { }, null, this)

    this.trucks.push(truck)
  }

  update() {
    const pads = this.input.gamepad.gamepads
    const gamepad = pads[0] || {}
    if (loop % 100 === 0) {
      console.info('loop', loop)

      console.info('taxis', this.taxis)
    }
    if (loop % 1000 === 0) {
      console.info('taxi loop', loop)

      this.addTaxi()
    }
    if (loop > 0 && loop % 1600 === 0) {
      console.info('taxi loop', loop)

      this.addTruck()
    }
    this.taxis.forEach(taxi => {
      if (taxi && taxi.setVelocityY) {
        try {
          taxi.setVelocityY(50)
        } catch (err) {
          console.error(err)
        }
      }
    })

    this.trucks.forEach(trucks => {
      if (trucks && trucks.setVelocityY) {
        try {
          trucks.setVelocityY(50)
        } catch (err) {
          console.error(err)
        }
      }
    })
    if (this.cursors.left.isDown || gamepad.left) {
      this.player.setVelocityX(-160)
      this.player.rotation = 100
    } else if (this.cursors.right.isDown || gamepad.right) {
      this.player.setVelocityX(360)
      this.player.rotation = -100
    } else {
      this.player.setVelocityX(0)
      this.player.rotation = 0
    }
    if (this.player.x < 595) {
      // this.player.setX(this.player.x + 5)
    }
    loop++
    if (this.cursors.down.isDown || gamepad.down) {
      this.bg.tilePositionY = this.bg.tilePositionY - 2
    } else if (this.cursors.up.isDown || gamepad.up) {
      this.bg.tilePositionY = this.bg.tilePositionY - 8
    } else {
      this.bg.tilePositionY = this.bg.tilePositionY - 5
    }
  }
}
