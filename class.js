class Sprite {
  constructor({position,
    image,
    frames = {max:1,hold:10},
     animate = false,
     sprites,
    rotation = 0})
    {
      this.position = position
      this.image = new Image()
      this.frames ={...frames, val:0 , elapsed : 0} 
      this.image.onload = () =>{
        this.width = this.image.width / this.frames.max
        this.height = this.image.height
    }
      this.image.src = image.src
      this.animate = animate
      this.sprites = sprites
      this.opacity = 1
      this.rotation = rotation
    }

    draw(){
        c.save()
        c.translate(this.position.x+this.width/2,
          this.position.y+this.height/2)
        c.rotate(this.rotation)
        c.translate(-this.position.x-this.width/2,
          -this.position.y-this.height/2)
        c.globalAlpha = this.opacity
        c.drawImage(this.image,
          this.frames.val*this.width,0,
          this.image.width/this.frames.max,this.image.height,
          this.position.x,this.position.y,
          this.image.width/this.frames.max,this.image.height)
        c.restore()  
        
          if (!this.animate) return
          if(this.frames.max >1){
            this.frames.elapsed++
          }
          if (this.frames.elapsed % this.frames.hold ===0){
          if (this.frames.val <this.frames.max -1)
            this.frames.val++
          else
            this.frames.val = 0
          }
        }
    
  }
  class Monster extends Sprite{
    constructor({
      position,
      image,
      frames = {max:1,hold:10},
      animate = false,
      sprites,
      rotation = 0,
      isEnemy = false,
      name,
      attacks,
      level = 1,
      health = 100,
      mp = 100
    }){
      super({
      position,
      image,
      frames,
      animate,
      sprites,
      rotation
      })
      this.health = health
      this.mp = mp
      this.exp = 0
      this.isEnemy = isEnemy
      this.name = name
      this.attacks = attacks
      this.level = level
    }
    checklv(){
      if (this.exp>=100){
        this.exp-= 100
        gblevel += 1
        this.level = gblevel
        document.querySelector('#playerLv').innerHTML = 
        'Lv'+this.level
        // document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 
        this.name +' grew to Lv'+this.level+'!'
      }
    }
    faint(){
      document.querySelector('#dialogueBox').innerHTML =
       this.name+' fainted! '
       gsap.to(this.position,{
         y:this.position.y+20
       })
       gsap.to(this,{
         opacity:0
       })
       audio.battle.stop()
       audio.victory.play()

    }
    attack({attack,recipient,renderedSprites}){
      document.querySelector('#dialogueBox').style.display = 'block'
      document.querySelector('#dialogueBox').innerHTML = this.name+' used '+attack.name
      let healthBar = '#enemyHealthBar'
      if (this.isEnemy) {healthBar = '#playerHealthBar'}

      let MPbar = '#playerMP'
      if (this.isEnemy) {MPbar = '#enemyMP'}
      let rotation = 1
      if(this.isEnemy){
        rotation =-2.2
      }
      recipient.health -=attack.damage
      this.mp -= attack.mp
      switch(attack.name){
        case 'Nuclear Bomb':
          const bombimage = new Image()
          bombimage.src = './img/nuclearbombfinal.png'
          const bomb = new Sprite({
            position:{
              x:this.position.x,
              y:this.position.y
            },
            image:bombimage,
            frames:{
              max:1,
              hold:10
            },
            animation:false,
            rotation

          })
          const explosionimage = new Image()
          explosionimage.src = './img/explosive.png'
          const explosion = new Sprite({
            position:{
              x:recipient.position.x-40,
              y:recipient.position.y-20
            },
            image: explosionimage,
            frames:{
              max:1,
              hold:10
            },
            animation:false
          })
          renderedSprites.splice(1,0,bomb)
          gsap.to(MPbar,{
            width: this.mp+'%',
            onComplete:()=>{
              gsap.to(bomb.position,{
                x:recipient.position.x,
                y:recipient.position.y,
                onComplete:()=>{
                  audio.explosionsound.play()
                  renderedSprites.splice(1,1)
                  renderedSprites.splice(2,0,explosion)
                  gsap.to(explosion,{
                    yoyo:true,
                    opacity:0,
                    duration:1.5,
                    onComplete:()=>{
                      gsap.to(healthBar,{
                        width: recipient.health+'%'
                      })
                      gsap.to(recipient.position,{
                        x:recipient.position.x+10,
                        yoyo:true,
                        repeat:5,
                        duration: 0.08
                      })
            
                      gsap.to(recipient,{
                        opacity:0,
                        repeat:5,
                        yoyo:true,
                        duration: 0.08
                      })
                      renderedSprites.splice(2,1)
                    }
                  })
                  
                }
              })
            }
          })
          break
        case 'Fireball':
          audio.initFireball.play()
          const fireballImage = new Image()
          fireballImage.src = './img/fireball.png'
          const fireball = new Sprite({
            position:{
              x:this.position.x,
              y:this.position.y
            },
            image : fireballImage,
            frames:{
              max:4,
              hold:10
            },
            animate: true,
            rotation
          })
          renderedSprites.splice(1,0,fireball)
          gsap.to(MPbar,{
            width: this.mp+'%',
            onComplete:()=>{
              gsap.to(fireball.position,{
                x:recipient.position.x,
                y:recipient.position.y,
                onComplete:()=>{
                  audio.fireballHit.play()
                  gsap.to(healthBar,{
                    width: recipient.health+'%'
                  })
                  gsap.to(recipient.position,{
                    x:recipient.position.x+10,
                    yoyo:true,
                    repeat:5,
                    duration: 0.08
                  })
        
                  gsap.to(recipient,{
                    opacity:0,
                    repeat:5,
                    yoyo:true,
                    duration: 0.08
                  })
                  renderedSprites.splice(1,1)
                }
              })
            }
          })
          // gsap.to(fireball.position,{
          //   x:recipient.position.x,
          //   y:recipient.position.y,
          //   onComplete:()=>{
          //     audio.fireballHit.play()
          //     gsap.to(healthBar,{
          //       width: recipient.health+'%'
          //     })
          //     gsap.to(recipient.position,{
          //       x:recipient.position.x+10,
          //       yoyo:true,
          //       repeat:5,
          //       duration: 0.08
          //     })
    
          //     gsap.to(recipient,{
          //       opacity:0,
          //       repeat:5,
          //       yoyo:true,
          //       duration: 0.08
          //     })
          //     renderedSprites.splice(1,1)
          //   }
          // })
          break
        case 'Tackle':
          const tl = gsap.timeline()
      let movementdistance =20
      if (this.isEnemy){movementdistance = -20}
      gsap.to(MPbar,{
        width: this.mp+'%',
        onComplete:()=>{
          tl.to(this.position,{
            x:this.position.x-20
          }).to(this.position,{
            x:this.position.x+movementdistance*2,
            duration:0.1,
            onComplete:()=>{
              audio.tackleHit.play()
              gsap.to(healthBar,{
                width: recipient.health-attack.damage+'%'
              })
              gsap.to(recipient.position,{
                x:recipient.position.x+10,
                yoyo:true,
                repeat:5,
                duration: 0.08
              })
    
              gsap.to(recipient,{
                opacity:0,
                repeat:5,
                yoyo:true,
                duration: 0.08
              })
            }
          }).to(this.position,{
            x:this.position.x
          })
        }
      })
      // tl.to(this.position,{
      //   x:this.position.x-20
      // }).to(this.position,{
      //   x:this.position.x+movementdistance*2,
      //   duration:0.1,
      //   onComplete:()=>{
      //     audio.tackleHit.play()
      //     gsap.to(healthBar,{
      //       width: recipient.health-attack.damage+'%'
      //     })
      //     gsap.to(recipient.position,{
      //       x:recipient.position.x+10,
      //       yoyo:true,
      //       repeat:5,
      //       duration: 0.08
      //     })

      //     gsap.to(recipient,{
      //       opacity:0,
      //       repeat:5,
      //       yoyo:true,
      //       duration: 0.08
      //     })
      //   }
      // }).to(this.position,{
      //   x:this.position.x
      // })
      break
      }
    }
  }

  class Boundary{
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}