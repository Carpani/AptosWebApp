import { browser,type Browser} from 'wxt/browser';

var tabId:number;
var auxB=browser;
export default defineBackground(() => {
   console.log('Hello background!', { id: browser.runtime.id });

  // async function getTab() {
  //  let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  //  console.log("getTab",tab.id);
  //  tabId=tab.id||-1;
  //  return tab;
  // };

function getTab() {
    let tab:Browser.tabs.Tab;
  return   browser.tabs.query({ active:true })
   .then(
      (tabs)=>{
        tab=tabs[0];
        console.log("getTab",tabs[0].id,tab.id);
        tabId=tab.id||-1;
        return tab;
      }
    )
    .catch(e=>{
      console.log("error en gettab",e);
    })

  };



  function sendMessage(msg:any,port:Browser.runtime.Port){
    // port.onDisconnect.addListener(()=>{
    //   port=browser.tabs.connect(tabId,port);
    //   sendMessage(msg,port);
    // });
    try  {
      port.postMessage(msg);
    }
    catch(e) {
      console.log("Post Error:",e);
      port=connect(tabId,port.name);
      port.postMessage(msg);
    }

  }

  function connect(tabId:number,portName:string){
    console.log("connect for tab ",tabId,portName); 
    let port:Browser.runtime.Port=browser.tabs.connect(tabId,{name:portName}); // conexion al canal
    port.onDisconnect.addListener(()=>{
      port=browser.tabs.connect(tabId,{name:portName});
    });
    port.postMessage({type:"start"});
    return port;
  }

  browser.runtime.onInstalled.addListener(async () => {
    const tabs = await getTab();
    console.log("Todas las tabs:", tabs);
  });

async function main(){
  getTab()
    .then(tab=>{
          console.log("tab",tab,browser);
  
          let portBack:Browser.runtime.Port;

          browser.runtime.onMessage.addListener(
            (msg)=>{
              console.log("General Msg Rcv:",msg);
              if(msg.type=="init"){
                portBack=connect(tabId,"conn-back");

                portBack.onMessage.addListener((msg)=>
                {
                  console.log(`RCV From ${portBack.name}:`,msg);
                  sendMessage("rcv front...",portBack);
                });
              }
            }
        );
      }
    )
  .catch(e=>console.log(e));

}

main();
});

   
// https://listado.mercadolibre.com.uy/api/search/picturesCarousel?item_id=MLU1256274062&variation_ids=
// _n.ctx.r.appProps.sharedState.search.results[].metadata.id - url - url_fragments