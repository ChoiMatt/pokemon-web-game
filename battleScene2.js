const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image : battleBackgroundImage
})

let emby 
let draggle 
let firstboss
let renderedSprites
let battleAnimationId
let queue 
//emby.attacks.forEach((attack)=>{
//   const button = document.createElement('botton')
  //  button.innerHTML = 'Fireball'
 //   document.querySelector('#attacksBox').append(button)
//})

function initBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#enemyMP').style.width = '100%'
    document.querySelector('#playerMP').style.width = '100%'
    emby = new Monster(monsters.Emby)
    draggle = new Monster(monsters.Draggle)
    firstboss = new Monster(monsters.Boss)
    if (bossbattle.initiated === true){
        renderedSprites = [firstboss,emby]
        document.querySelector('#enemyname').innerHTML = 'Boss'
        document.querySelector('#enemylv').style.left = '110px'
        document.querySelector('#enemylv').innerHTML = 'Lv99'
        keys.Enter.pressed = false
    }
    else{
        renderedSprites = [draggle,emby]
        document.querySelector('#enemyname').innerHTML = 'Draggle'
        document.querySelector('#enemylv').style.left = '83px'
        document.querySelector('#enemylv').innerHTML = 'Lv1'
    }
    
    queue = []
    document.querySelectorAll('button').forEach((button)=>{
        button.addEventListener('click',(e)=>{
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            console.log(selectedAttack)
            emby.attack({
                attack: selectedAttack,
            recipient:renderedSprites[0],
            renderedSprites
        })
    
        if (renderedSprites[0].health <=0){
            bossbattle.initiated = false
            emby.exp +=100
            queue.push(()=>{
                renderedSprites[0].faint()
                })
            queue.push(()=>{
                emby.checklv()
                })
             queue.push(()=>{
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    onComplete: ()=>{
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#userInterface').style.display = 'none'
                        gsap.to('#overlappingDiv',{
                            opacity:0
                        })
                        battle.initiated = false
                        audio.Map.play()
                    }
                })
                })
        }
    
        
        const randomAttack = renderedSprites[0].attacks[Math.floor(Math.random() * renderedSprites[0].attacks.length)]
    
        queue.push(()=>{
            renderedSprites[0].attack({
                    attack: randomAttack,
                    recipient:emby,
                    renderedSprites
            })
            if (emby.health <=0){
                bossbattle.initiated = false
                queue.push(()=>{
                    emby.faint()
                    })
                    queue.push(()=>{
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            onComplete: ()=>{
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'
                                gsap.to('#overlappingDiv',{
                                    opacity:0
                                })
                                battle.initiated = false
                                audio.Map.play()
                            }
                        })
                        })
            }
        })
    })
    button.addEventListener('mouseenter',(e)=>{
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}
function animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    
     renderedSprites.forEach((sprite) =>{
         sprite.draw()
    })
}
animate()
//initBattle()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click',(e)=>{
    if(queue.length>0){
        queue[0]()
        queue.shift()
    }
    else
    e.currentTarget.style.display = 'none'
})