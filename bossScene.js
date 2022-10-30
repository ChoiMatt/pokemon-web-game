const BossbattleBackgroundImage = new Image()
BossbattleBackgroundImage.src = './img/battleBackground.png'
const BossbattleBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image : BossbattleBackgroundImage
})

let emby2
let firstboss
let renderedSprites2
let BossbattleAnimationId
let queue2
//emby.attacks.forEach((attack)=>{
//   const button = document.createElement('botton')
  //  button.innerHTML = 'Fireball'
 //   document.querySelector('#attacksBox').append(button)
//})

function initBossBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#enemyMP').style.width = '100%'
    document.querySelector('#playerMP').style.width = '100%'
    emby2 = new Monster(monsters.Emby)
    firstboss = new Monster(monsters.Boss)
    renderedSprites2= [firstboss,emby2]
    queue2 = []
    document.querySelectorAll('button').forEach((button)=>{
        button.addEventListener('click',(e)=>{
            const selectedAttack2 = attacks[e.currentTarget.innerHTML]
            console.log(selectedAttack2)
            emby2.attack({
                attack: selectedAttack2,
            recipient:firstboss,
            renderedSprites2
        })
    
        if (firstboss.health <=0){
            emby2.exp +=100
            queue2.push(()=>{
                firstboss.faint()
                })
            queue2.push(()=>{
                emby2.checklv()
                })
             queue2.push(()=>{
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    onComplete: ()=>{
                        cancelAnimationFrame(BossbattleAnimationId)
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
    
        
        const randomAttack2 = firstboss.attacks[Math.floor(Math.random() * firstboss.attacks.length)]
    
        queue2.push(()=>{
            firstboss.attack({
                    attack: randomAttack2,
                    recipient:emby2,
                    renderedSprites2
            })
            if (emby2.health <=0){
                queue2.push(()=>{
                    emby2.faint()
                    })
                    queue2.push(()=>{
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            onComplete: ()=>{
                                cancelAnimationFrame(BossbattleAnimationId)
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
        const selectedAttack2 = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack2.type
        document.querySelector('#attackType').style.color = selectedAttack2.color
        })
    })
}
function animateBossBattle(){
    BossbattleAnimationId = window.requestAnimationFrame(animateBossBattle)
    BossbattleBackground.draw()
    
     renderedSprites2.forEach((sprite) =>{
         sprite.draw()
    })
}
//animate()
//initBattle()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click',(e)=>{
    if(queue2.length>0){
        queue2[0]()
        queue2.shift()
    }
    else
    e.currentTarget.style.display = 'none'
})