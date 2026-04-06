
const encoder=new TextEncoder();

import { browser, type Browser } from 'wxt/browser';
class extPage {
  url:string="";
  site:string="";
  id:string="";
  trace:any[]=[];
  port:(Browser.runtime.Port|undefined)=undefined;
  constructor(){
    this.url=location.href;
    this.site=location.host;
    crypto.subtle.digest("SHA-256",encoder.encode(this.url))
      .then((x)=>{this.id=(new Uint8Array(x)).toString()})
      .catch((x)=>{console.log(x);return(x);});
      browser.runtime.onMessage.addListener(this.handleGenMsg);
  };

  connect(){
    try {
      this.port=browser.runtime.connect({name:this.id});
    } catch (e) {
        this.port=browser.runtime.connect({name:this.id});
    }
    
    this.port.onMessage.addListener((msg,lPort:Browser.runtime.Port)=>{
      if(this.port?.name!=lPort.name){
        return;
      }
      this.trace.push({"rcv":msg});
    });

    this.port.onDisconnect.addListener((port)=>{
      this.port=browser.runtime.connect({name:this.id});
    });

    return this.port;
  };
  
  handleGenMsg(msg:any,sender:any,sendResponse:any){
    console.log(msg,sender);
  };

  sendMsg(msg:any,type:string=""){
    this.port?.postMessage({"orig":this,"type":type,"msg":msg});
    this.trace.push({"sent":{"type":type,"msg":msg}});
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

export default defineContentScript({
   matches: ["https://listado.mercadolibre.com.uy/inmuebles/apartamentos/*"],

   main(ctx) {
    const currPage=new extPage();
    
  //    function sendMessage(msg:any,port:Browser.runtime.Port){
  //   // port.onDisconnect.addListener(()=>{
  //   //   port=browser.tabs.connect(tabId,port);
  //   //   sendMessage(msg,port);
  //   // });
  //   console.log(msg,"--->>",port.name);
  //   try  {
  //     port.postMessage(msg);
  //   }
  //   catch(e) {
  //     console.log("Post Error:",e);
  //     port=connect(port.name);
  //     if(port)
  //     port.postMessage(msg);
  //   }

  // }

  // function connect(portName:string){
  //   console.log("connect name",portName);
  //   let port:Browser.runtime.Port=browser.runtime.connect({name:portName}); // conexion al canal
  //   return port;
  // }
  //   let backPort:Browser.runtime.Port;
  
  //   let continuar=false;
  //   browser.runtime.sendMessage({type:"init"});
  //   let countConnect=0;
  //   console.log("Ini Connect");
  //   browser.runtime.onConnect.addListener(    
  //     (port)=>{
  //       console.log("connect",++countConnect);
  //       port.onDisconnect.addListener(()=>{
  //           port=browser.runtime.connect({name:port.name});
  //         });

  //       port.onMessage.addListener((msg)=>
  //       {
  //         sendMessage({type:"Received"},backPort);
  //       });
        
  //       backPort=port;

     
       

  //     }
  //   );
  
  //   setTimeout(()=>{
  //     backPort=connect("conn-back");
  //     sendMessage({type:"onChannel",message:"first"},backPort);
  //     backPort.onDisconnect.addListener(()=>{
  //     backPort=browser.runtime.connect({name:backPort.name});
  //     sendMessage({type:"start"},backPort);
  //   });
  //     continuar=true;
  //   },
  //   1000);

  //    setInterval(()=>{
  //         console.log("Sending Message",backPort);
  //         sendMessage({type:"onChannel" ,message:"onConnect"},backPort);
  //       },
  //       5000);
  //   //while(!continuar);

  //   let app=document.createElement("ol");

  //   let pos=document.querySelector(".brand-wrapper-showroom-desktop")?.parentElement;
  //   console.log('MI content script');
  //   pos?.prepend(app);
  //     backPort=connect("conn-back");
  //   //sendMessage("hola back...",backPort);
  //    backPort.onMessage.addListener((message)=>{
  //       console.log(message);
  //     });
  
  
     //   });
 
    // const ui = createIntegratedUi(ctx, {
    //   position: 'inline',
    //   anchor: pos,
    //   append: 'first',
    //   onMount: (container) => {
    //     // Append children to the container
    //     app.textContent = 'APP CONTENT...';
    //     container.append(app);
    //   },
    //   });
   
    // setTimeout(async ()=>{
    //  browser.runtime.sendMessage({type:"Hola",message:"Hola Back !!"});
    //     },1000);  
    // browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   app.innerText=JSON.stringify(message,null,2);
    //   console.log("Content script received message:", {m:message,s:sender});
    //   sendResponse("QUE PASA Back???");
    //   return true;
    // });
   // pos?.childNodes[0].remove();

    //ui.mount();
   },
   });

