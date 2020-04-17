import Phaser from 'phaser'
import Align from '../utils/align'

const PLAYER_KEY = 'player'
const TAXI_KEY = 'taxi'
const TRUCK_KEY = 'truck'
const MINI_TRUCK_KEY = 'mini-truck'
const VAN_KEY = 'van'

const LANES = [220, 360, 490, 600]
let loop = 0
export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('intro')
    this.cars = []
  }

  preload() {
    this.load.image('background', 'assets/images/backgrounds/background-1.png')
    this.load.image(PLAYER_KEY, 'assets/images/entities/Car.png')
    this.load.image(TAXI_KEY, 'assets/images/entities/taxi.png')
    this.load.image(TRUCK_KEY, 'assets/images/entities/truck.png')
    this.load.image(MINI_TRUCK_KEY, 'assets/images/entities/Mini_truck.png')
    this.load.image(VAN_KEY, 'assets/images/entities/Mini_van.png')
  }

  playerHit(player, enemy) {
    this.cars = this.cars.reduce((prev, current) => {
      console.log('current', current)
      if (current === enemy) {
        return prev
      }
      prev.push(current)
      return prev
    }, [])

    const crash = this.tweens.add({
      targets: enemy,
      x: enemy.x + 150,
      rotation: -100,
      duration: 500,
      ease: 'Linear',
      repeat: 0,
      onComplete: (t, targets, custom) => {
        enemy.destroy()
      },
    })

    player.setVelocity(0, 0)

    player.tweening = true
    player.rotation = 100
    const tw = this.tweens.add({
      targets: player,

      x: player.x - 50,
      rotation: -100,
      duration: 500,
      ease: 'Linear',
      repeat: 0,
      onComplete: (t, targets, custom) => {
        player.tweening = false
      },
    })
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

    this.player = this.physics.add.sprite(595, 550, PLAYER_KEY)

    this.player.tweening = false
    this.player.setScale(0.7, 0.7)

    this.player.setCollideWorldBounds(true)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  addTaxi() {
    this.addVehicle(TAXI_KEY)
  }

  addTruck() {
    this.addVehicle(TRUCK_KEY)
  }

  addVehicle(key = TAXI_KEY) {
    const lane = Phaser.Math.Between(0, 3)
    console.info('lane', lane)
    const car = this.physics.add.sprite(LANES[lane], -200, key)
    car.setScale(0.7, 0.7)

    this.physics.add.collider(this.player, car, this.playerHit, null, this)

    this.cars.push(car)
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
    if (loop > 0 && loop % 2200 === 0) {
      this.addVehicle(VAN_KEY)
    }
    this.cars.forEach(car => {
      if (car && car.setVelocityY) {
        try {
          car.setVelocityY(50)
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
      if (!this.player.tweening) {
        this.player.rotation = 0
      }
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
