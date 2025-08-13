// thsi is for our elements
const askForm = document.getElementById('askForm');
const input   = document.getElementById('q');
const chat    = document.getElementById('chat');
const btn     = document.getElementById('sendBtn');

// submisson handler
askForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;

  appendMsg(text,'user');       // show user bubble
  input.value='';
  input.style.height='';
  btn.disabled = true;

  appendMsg('Typing…','bot','pending');   // placeholder

  try{
    const res = await fetch('/datadex',{          // we'll match cloud function route here...
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:text})
    });
    if(!res.ok) throw new Error(`Server ${res.status}`);
    const {reply} = await res.json();
    replacePending(reply);
  }catch(err){
    console.error(err);
    replacePending('❌ Sorry, something went wrong. Please try again.');
  }finally{
    btn.disabled = false;
  }
});

/* helpers  */
function appendMsg(text,who,status=''){
  const div = document.createElement('div');
  div.className = `msg ${who}` + (status?` ${status}`:'');
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;     // for auto-scroll
}

function replacePending(newText){
  const pending = document.querySelector('.msg.bot.pending');
  if(pending){
    pending.textContent = newText;
    pending.classList.remove('pending');
  }
}

/* Auto-grow textarea */
input.addEventListener('input', ()=>{
  input.style.height='auto';
  input.style.height=input.scrollHeight+'px';
});

/* enter submits, shift+enter should add line */
input.addEventListener('keydown',(e)=>{
  if(e.key==='Enter' && !e.shiftKey){
    e.preventDefault();
    btn.click();
  }
});