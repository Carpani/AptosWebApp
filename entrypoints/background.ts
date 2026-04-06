import { browser,type Browser} from 'wxt/browser';

class backPage {
  id:string="";
  trace:any[]=[];
  ports = new Map<number, Browser.runtime.Port|0>();
  lastPage:number=-1;
  constructor(){
    browser.runtime.onMessage.addListener(this.handlePageUp);
  };

  onConnect(port:Browser.runtime.Port){
    let tabId = port.sender?.tab?.id!;
    this.ports.set(tabId, port);
    port.onMessage.addListener((msg,port)=>{
      console.log("rcv from ",tabId);
      this.trace.push({"rcv":msg});
    });

    port.onDisconnect.addListener(() => {
      this.ports.delete(tabId)
    });
  }
  // connect(tabId){
  //   try {
  //     this.port=browser.tabs.connect({name:this.id});
  //   } catch (e) {
  //       this.port=browser.runtime.connect({name:this.id});
  //   }
    
  //   this.port.onMessage.addListener((msg,lPort:Browser.runtime.Port)=>{
  //     if(this.port?.name!=lPort.name){
  //       return;
  //     }
  //     this.trace.push({"rcv":msg});
  //   });

  //   this.port.onDisconnect.addListener((port)=>{
  //     this.port=browser.runtime.connect({name:this.id});
  //   });

  //   return this.port;
  // };
  
  handlePageUp(msg:any,sender:any,sendResponse:any){
    console.log(msg,sender);
    this.lastPage=sender.tab?.id!;
    this.ports.set(this.lastPage,0);
  };

  sendMsg(tabId:number, msg:any,type:string=""){
    let port=this.ports.get(tabId);
    if(port!=0){
      port?.postMessage({"orig":"bkg","type":type,"msg":msg});
      this.trace.push({"sent":{"type":type,"msg":msg}});
    } else {
      this.trace.push({"sent":{"type":"error","msg":"port is 0"}});
    }
  }

  async imUp(){
      // avisa al back que esta vivo.
    browser.runtime.sendMessage({orig:this.id,type:"Up",msg:""})
      .then((x)=>{
        console.log("I'm Up RCV:",JSON.stringify(x));
      })
      .catch((x)=>{
        console.log(x);
        return x;
      });

  };

}

export default defineBackground(() => {
   const back=new backPage();
   console.log('Hello background!', { id: browser.runtime.id });

  // async function getTab() {
  //  let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  //  console.log("getTab",tab.id);
  //  tabId=tab.id||-1;
  //  return tab;
  // };

// function getTab() {
//     let tab:Browser.tabs.Tab;
//   return   browser.tabs.query({ active:true })
//    .then(
//       (tabs)=>{
//         tab=tabs[0];
//         console.log("getTab",tabs[0].id,tab.id);
//         tabId=tab.id||-1;
//         return tab;
//       }
//     )
//     .catch(e=>{
//       console.log("error en gettab",e);
//     })

//   };



//   function sendMessage(msg:any,port:Browser.runtime.Port){
//     // port.onDisconnect.addListener(()=>{
//     //   port=browser.tabs.connect(tabId,port);
//     //   sendMessage(msg,port);
//     // });
//     try  {
//       port.postMessage(msg);
//     }
//     catch(e) {
//       console.log("Post Error:",e);
//       port=connect(tabId,port.name);
//       port.postMessage(msg);
//     }

//   }

//   function connect(tabId:number,portName:string){
//     console.log("connect for tab ",tabId,portName); 
//     let port:Browser.runtime.Port=browser.tabs.connect(tabId,{name:portName}); // conexion al canal
//     port.onDisconnect.addListener(()=>{
//       port=browser.tabs.connect(tabId,{name:portName});
//     });
//     port.postMessage({type:"start"});
//     return port;
//   }

//   browser.runtime.onInstalled.addListener(async () => {
//     const tabs = await getTab();
//     console.log("Todas las tabs:", tabs);
//   });

// function main(){
// //async function main(){
//   // getTab()
//   //   .then(tab=>{
//   //         console.log("tab",tab,browser);
  
//   //         let portBack:Browser.runtime.Port;

//   //         browser.runtime.onMessage.addListener(
//   //           (msg)=>{
//   //             console.log("General Msg Rcv:",msg);
//   //             if(msg.type=="init"){
//   //               portBack=connect(tabId,"conn-back");

//   //               portBack.onMessage.addListener((msg)=>
//   //               {
//   //                 console.log(`RCV From ${portBack.name}:`,msg);
//   //                 sendMessage("rcv front...",portBack);
//   //               });
//   //             }
//   //           }
//   //       );
//   //     }
//   //   )
//   // .catch(e=>console.log(e));

// }

// main();
});

   
// https://listado.mercadolibre.com.uy/api/search/picturesCarousel?item_id=MLU1256274062&variation_ids=
// _n.ctx.r.appProps.sharedState.search.results[].metadata.id - url - url_fragments