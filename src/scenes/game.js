
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";
export default function game(){
    k.setGravity(3100);
    const citySfx=k.play("city",{volume:0.2,loop:true});

    //Same which we have done in mainMenue
    const bgPieceWidth=1920;
    //We are making infinite loop i.e 1stchemical-bg then 2dtchemical-bg in a loop 
    //After completion of 1-2 then 2-1 then 1-2......
    const bgPieces=[
        //game object 1
        k.add([k.sprite("chemical-bg"),k.pos(0,0),k.scale(2)],k.opacity(0.8)),
        //game object 2
        k.add([k.sprite("chemical-bg"),k.pos(bgPieceWidth*2,0),k.scale(2)],k.opacity(0.8))
    ];

    const platformWidth=1280;
    const platforms=[
        //game object 1
        k.add([k.sprite("platforms"),k.pos(0,450),k.scale(4)]),
        //game object 2
        k.add([k.sprite("platforms"),k.pos(platformWidth*4,450),k.scale(4)])
    ];
    //score
    let score=0;
    let scoreMultiplyer=0;
    
    const scoreText=k.add([
        k.text("SCORE : 0",{font:"mania",size:72}),
        k.pos(20,20),
    ]);


    //call sonic
    const sonic=makeSonic(k.vec2(200,745));
    sonic.setControls();
    sonic.setEvents();
    //collide with enemy
    sonic.onCollide("enemy",(enemy)=>{
        if(!sonic.isGrounded()){
            k.play("destroy",{volume:0.5});
            k.play("hyper-ring",{volume:0.5});
            k.destroy(enemy)
            sonic.play("jump")
            sonic.jump();
            
            scoreMultiplyer +=1;
            score+= 10*scoreMultiplyer;
            scoreText.text=`SCORE : ${score}`;
            if(scoreMultiplyer === 1)sonic.ringCollectUI.text=`+10`;
            if(scoreMultiplyer > 1) sonic.ringCollectUI.text=`x${scoreMultiplyer}`;
            k.wait(1,()=>{
                sonic.ringCollectUI.text="";
            })
            return;
        }
        k.play("hurt",{volume:0.5})
        k.setData("current-score",score)
        k.go("gameover",citySfx);
    })
    //collide with ring
    sonic.onCollide("ring",(ring)=>{
        k.play("ring",{volume:0.5});
        k.destroy(ring);
        score++;
        scoreText.text=`SCORE : ${score}`;
        sonic.ringCollectUI.text="+1";
        k.wait(1,()=>{
            sonic.ringCollectUI.text="";
        })
    });

    //AS game progress the speed should eventually increase
    let gameSpeed=300;
    k.loop(1,()=>{
        gameSpeed+=50;
    });

    //motobug
    const spawnMotoBug=()=>{
        const motobug=makeMotobug(k.vec2(1950,773));//right
        motobug.onUpdate(()=>{
            if(gameSpeed<3000){
                motobug.move(-(gameSpeed+300),0);//
                return;
            }
            motobug.move(-gameSpeed,0);//making harder motobug moves same speed as platform
        });
        motobug.onExitScreen(()=>{
            if(motobug.pos.x < 0) k.destroy(motobug);
        });

        const waitTime=k.rand(0.5,2.5);
        k.wait(waitTime,spawnMotoBug);//Spwaning enimies
    };
    spawnMotoBug();//as Recursice func

    const spwanRing=()=>{
        const ring=makeRing(k.vec2(1950,745));
        ring.onUpdate(()=>{
            ring.move(-(gameSpeed),0);//
        });
        ring.onExitScreen(()=>{
            if(ring.pos.x < 0) k.destroy(ring);
        });

        const waitTime=k.rand(0.5,3);
        k.wait(waitTime,spwanRing);//Spwaning enimies
    };
    spwanRing();


    //We are gonna create rectangle(platform for physics as sonic jumos on it)
    //Sonic(box) that jumps on another BOX (platfom (which is invisible)) STATIONARILY
    //game object
    k.add([
        k.rect(1920,300),
        k.opacity(0),
        k.area(),
        k.pos(0,832),
        k.body({isStatic:true}),
    ])


    k.onUpdate(()=>{
        if(sonic.isGrounded()) scoreMultiplyer=0;
           //Update process is same as mainMenue 
          //for Chemical bg
          if(bgPieces[1].pos.x < 0){
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2,0);
            bgPieces.push(bgPieces.shift());
            //shift poping 1st ele from array
            //push adding ele to last of array
            //poping 1st ele and adding to last
        }
        bgPieces[0].move(-100,0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2,0);

        // for jump effect
        bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 10 - 50);
        bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 10 - 50);


        //for Platform
        //rename this platforms[1].width  with platformWidth
        if(platforms[1].pos.x<0){
            platforms[0].moveTo(platforms[1].pos.x + platformWidth*4,450);
            platforms.push(platforms.shift());
        }
        platforms[0].move(-gameSpeed,0);
        platforms[1].moveTo(platforms[0].pos.x + platformWidth*4,450);

    })
    
}