const API = "https://api.ayush-jsrt.workers.dev"

const editor = document.getElementById("editor")
const noteNameEl = document.getElementById("noteName")
const status = document.getElementById("status")

// extract note name from URL
let note = window.location.pathname.replace("/", "")

if(!note){
  note = "untitled"
  history.replaceState({}, "", "/untitled")
}

noteNameEl.textContent = note

let timer = null
let lastContent = ""

// load note
async function loadNote(){

  const r = await fetch(API + "/notes/" + note)

  if(r.ok){
    const data = await r.json()
    editor.value = data.content
    lastContent = data.content
  }

}

loadNote()

// autosave logic
editor.addEventListener("input", ()=>{

  status.textContent = "editing..."

  if(timer) clearTimeout(timer)

  timer = setTimeout(saveNote,5000)

})

async function saveNote(){

  const content = editor.value

  if(content === lastContent){
    status.textContent = "saved"
    return
  }

  status.textContent = "saving..."

  await fetch(API + "/notes/" + note,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      content:content
    })
  })

  lastContent = content
  status.textContent = "saved"

}