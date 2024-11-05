
import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";

export default function mainMenue(){
    //Initially best-score is set to 0 as no one played , if played then 
    if(!k.getData("best-score")) k.setData("best-score",0);
    //jump(from kaplayCtx file ) is triggered then call actual game function
    k.onButtonPress("jump",()=>k.go("game"));

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
    
    //for Displaying text
    //for GAME NAME
    k.add([
        k.text("SONIC RING RUN",{font:"mania",size:96}),
        k.pos(k.center().x,200),
        k.anchor("center")
    ]);
    //for BUTTON nums
    k.add([
        k.text("Press Space/Click/Touch to Play",{font:"mania",size:32}),
        k.pos(k.center().x,k.center().y-200),
        k.anchor("center")
    ]);



    //Calling sonic.js file for displaying sonic
    makeSonic(k.vec2(200,745));

    
    //Create or Update loop
    k.onUpdate(()=>{
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

        //for Platform
        if(platforms[1].pos.x<0){
            platforms[0].moveTo(platforms[1].pos.x + platforms[1].width*4,450);
            platforms.push(platforms.shift());
        }
        platforms[0].move(-4000,0);
        platforms[1].moveTo(platforms[0].pos.x + platforms[1].width*4,450);
    });
    //parallax effect



}