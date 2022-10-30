const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionMap = []
for (let i =0;i<collisions.length;i+=70){
    collisionMap.push(collisions.slice(i,70+i))
}

const battlezonesMap = []
for (let i =0;i<battlezonesdata.length;i+=70){
    battlezonesMap.push(battlezonesdata.slice(i,70+i))
}

const boundaries = []

const offset = {
    x:-500,
    y:-200
}

collisionMap.forEach((row,i) =>{
    row.forEach((symbol,j)=>{
        if (symbol ===1)
        boundaries.push(new Boundary({ 
            position:{
                x:j*Boundary.width + offset.x,
                y:i*Boundary.height + offset.y
            }
        }))
    })
})

const BattleZones = []

battlezonesMap.forEach((row,i) =>{
    row.forEach((symbol,j)=>{
        if (symbol ===1)
        BattleZones.push(new Boundary({ 
            position:{
                x:j*Boundary.width + offset.x,
                y:i*Boundary.height + offset.y
            }
        }))
    })
})

const bossMap = []

for (let i =0;i<bossenter.length;i+=70){
    bossMap.push(bossenter.slice(i,70+i))
}

const bossZones = []

bossMap.forEach((row,i) =>{
    row.forEach((symbol,j)=>{
        if (symbol ===1)
        bossZones.push(new Boundary({ 
            position:{
                x:j*Boundary.width + offset.x,
                y:i*Boundary.height + offset.y
            }
        }))
    })
})

const image = new Image()
image.src = './img/catty theme map2.png'

const foregroundimage = new Image()
foregroundimage.src = './img/foregroundmap2.png'

const playerdownImage = new Image()
playerdownImage.src = './img/playerdown.png'

const playerupImage = new Image()
playerupImage.src = './img/playerup.png'

const playerleftImage = new Image()
playerleftImage.src = './img/playerleft.png'

const playerrightImage = new Image()
playerrightImage.src = './img/playerright.png'

const bossImage = new Image()
bossImage.src = './img/newboss.png'
const boss = new Sprite({
    position :{
        x:canvas.width/2+440,
        y:canvas.height/2+700
    },
    image: bossImage,
    frames:{
        max:8,
        hold:20
    },
    animate : true
})
    //canvas.width/2-1,canvas.height/2-100,

const player = new Sprite({
    position :{
        x:canvas.width/2-1,
        y:canvas.height/2-100
    },
    image: playerdownImage,
    frames:{
        max:4,
        hold:10
    },
    sprites:{
        up:playerupImage,
        down:playerdownImage,
        left:playerleftImage,
        right:playerrightImage
    }

})
const background = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image: image
})

const foreground = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image: foregroundimage
})

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    },
    Enter:{
        pressed: false
    }
}
const movables = [background , ...boundaries,foreground,...BattleZones,boss,...bossZones]

function rectangularCollision({rectangle1,rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >=rectangle2.position.x&&
        rectangle1.position.x <= rectangle2.width + rectangle2.position.x&&
        rectangle1.position.y <= rectangle2.height + rectangle2.position.y&&
        rectangle1.position.y + rectangle1.height >=rectangle2.position.y
    )
}
const battle = {
    initiated : false
}
const bossbattle = {
    initiated : false
}
function animate (){
    const animationID = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary =>{
        boundary.draw()
        
    })
    BattleZones.forEach(BattleZone =>{
        BattleZone.draw()
        
    })
    bossZones.forEach(bossZone =>{
        bossZone.draw()
        
    })
    boss.draw()
   player.draw()
   foreground.draw()
   let moving = true
   player.animate = false
    if (battle.initiated) return
   if (keys.w.pressed ||keys.a.pressed ||keys.s.pressed ||keys.d.pressed){
    for (let i =0; i <BattleZones.length;i++){
        const BattleZone = BattleZones[i]
        const overlappingArea =  (Math.min(player.position.x+player.width,BattleZone.position.x+BattleZone.width)
        -Math.max(player.position.x,BattleZone.position.x)
        )*(Math.min(player.position.y+player.height,BattleZone.position.y+BattleZone.height)
        -Math.max(player.position.y,BattleZone.position.y))
        if (
            rectangularCollision({
                rectangle1:player ,
                rectangle2 : BattleZone
            }) &&
            overlappingArea >(player.width*player.height)/2
            && Math.random()<0.01
        )
        {
            console.log('activated battle')
            window.cancelAnimationFrame(animationID)
            audio.Map.stop()
            audio.initBattle.play()
            audio.battle.play()
            battle.initiated = true
            gsap.to('#overlappingDiv',{
                opacity: 1,
                repeat : 3,
                yoyo: true,
                duration: 0.4,
                onComplete(){
                    gsap.to('#overlappingDiv',{
                        opacity: 1,
                        duration: 0.4,
                        onComplete(){
                            initBattle()
                            animateBattle()
                            gsap.to('#overlappingDiv',{
                                opacity: 0,
                                duration: 0.4})
                        }
                    })
                }
            })
        break
        }
        
    }
//--------------------------------------------------------------

for (let i =0; i <bossZones.length;i++){
    const bossZone = bossZones[i]
    const overlappingAreaForBoss =  (Math.min(player.position.x+player.width,bossZone.position.x+bossZone.width)
    -Math.max(player.position.x,bossZone.position.x)
    )*(Math.min(player.position.y+player.height,bossZone.position.y+bossZone.height)
    -Math.max(player.position.y,bossZone.position.y))
    if (
        rectangularCollision({
            rectangle1:player ,
            rectangle2 : bossZone
        }) &&
        overlappingAreaForBoss >(player.width*player.height)/2
        && keys.Enter.pressed 
    )
    {
        console.log('activated battle')
        window.cancelAnimationFrame(animationID)
        audio.Map.stop()
        audio.initBattle.play()
        audio.battle.play()
        battle.initiated = true
        gsap.to('#overlappingDiv',{
            opacity: 1,
            repeat : 3,
            yoyo: true,
            duration: 0.4,
            onComplete(){
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    duration: 0.4,
                    onComplete(){
                        bossbattle.initiated = true
                        initBattle()
                        animateBattle()
                        gsap.to('#overlappingDiv',{
                            opacity: 0,
                            duration: 0.4})
                    }
                })
            }
        })
    break
    }
    
    
}

   }
    if (keys.w.pressed && lastKey === 'w'){
        player.animate = true
        player.image = player.sprites.up
        for (let i =0; i <boundaries.length;i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player ,
                    rectangle2 : {...boundary, position:{
                        x: boundary.position.x,
                        y: boundary.position.y+2
                    }
                    }
                })
            ){
            moving = false
            break
            }
            
        }
        
        if (moving)
        movables.forEach((movable)=>{
            movable.position.y +=2
        })
    }
    else if (keys.a.pressed && lastKey === 'a'){
        player.animate = true
        player.image = player.sprites.left
        for (let i =0; i <boundaries.length;i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player ,
                    rectangle2 : {...boundary, position:{
                        x: boundary.position.x+2,
                        y: boundary.position.y
                    }
                    }
                })
            ){
            moving = false
            break
            }
            
        }
        if (moving)
        movables.forEach((movable)=>{
            movable.position.x +=2
        })
    }
    else if (keys.s.pressed && lastKey === 's'){
        player.animate = true
        player.image = player.sprites.down
        for (let i =0; i <boundaries.length;i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player ,
                    rectangle2 : {...boundary, position:{
                        x: boundary.position.x,
                        y: boundary.position.y-2
                    }
                    }
                })
            ){
            moving = false
            break
            }
            
        }
        if (moving)
        movables.forEach((movable)=>{
            movable.position.y -=2
        })
    }
    else if (keys.d.pressed && lastKey === 'd'){
        player.animate = true
        player.image = player.sprites.right
        for (let i =0; i <boundaries.length;i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player ,
                    rectangle2 : {...boundary, position:{
                        x: boundary.position.x-2,
                        y: boundary.position.y
                    }
                    }
                })
            ){
            moving = false
            break
            }
            
        }
        if (moving)
        movables.forEach((movable)=>{
            movable.position.x -=2
        })
    }
}
//animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break
      case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break
  
      case 's':
        keys.s.pressed = true
        lastKey = 's'
        break
  
      case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
      case 'Enter':
        keys.Enter.pressed = true
        lastKey = 'Enter'
        break 
    
    }
  })

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
        keys.w.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
      case 's':
        keys.s.pressed = false
        break
      case 'd':
        keys.d.pressed = false
        break
      case 'Enter':
        // keys.Enter.pressed = false
        break
    }
  })

  let clicked = false
  addEventListener('click',()=>{
      if(!clicked){
          audio.Map.play()
          clicked = true
      }
  })
    