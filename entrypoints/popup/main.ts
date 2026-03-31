import './style.css';
import typescriptLogo from '@/assets/typescript.svg';
import wxtLogo from '/wxt.svg';
import { setupCounter } from '@/components/counter';


const port=browser.runtime.connect({"name":"fromPup"});

let msgs=document.getElementById("messages");
//  setTimeout(async ()=>{
//      browser.runtime.sendMessage({type:"Hola",message:"Hola Back !! Soy Popup"});
//         },1000);  
  
  port.onMessage.addListener((message) => {

      let li=document.createElement("li");
      console.log("Content script received message:", message);
      li.innerText=JSON.stringify(message,null,2)||"no hay msg";
      msgs?.append(li);
    return true;
  });

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://wxt.dev" target="_blank">
      <img src="${wxtLogo}" class="logo" alt="WXT logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>WXT + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the WXT and TypeScript logos to learn more
    </p>
  </div>
  <div style="border:1px red"> HOLA </div>
`;

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

document.querySelector<HTMLButtonElement>('#counter')?.addEventListener


document.querySelector<HTMLButtonElement>('#counter')?.addEventListener("click",(ev)=>{
  console.log("Enviando mensaje");

  port.postMessage({"type":"fromPup"});
});
