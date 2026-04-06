
const encoder=new TextEncoder();

import { browser, type Browser } from 'wxt/browser';
class frontPage {
  url:string="";
  site:string="";
  id:string="";
  trace:any[]=[];
  port:(Browser.runtime.Port|undefined)=undefined;
  constructor(){
    this.url=location.href;
    this.site=location.host;
    crypto.subtle.digest("SHA-256",encoder.encode(this.url))
      .then((x)=>{this.id=(new Uint8Array(x)).toString();
      this.imUp();
      })
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
    this.port?.postMessage({"orig":this.id,"type":type,"msg":msg});
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
    const currPage=new frontPage();
    
  
   },
   });

