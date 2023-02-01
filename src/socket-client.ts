import { Manager, Socket } from 'socket.io-client'

let socket: Socket;

export const connectToServer = ( token:string ) => {
  
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authentication: token,
      hola: 'mundo'
    }
  });

  if (socket) {
    socket.removeAllListeners()
  }

  socket = manager.socket('/');
  addListeners();

}

const addListeners = () => {
  const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;
  const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!;

  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

  socket.on('connect', () => {
    console.log('connected');
    serverStatusLabel.innerHTML = 'connected';
  })

  socket.on('disconnect', () => {
    console.log('disconnected');
    serverStatusLabel.innerHTML = 'disconnected';
  })

  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';
    clients.forEach( clientId => {
      clientsHtml += `<li>${ clientId }</li>`;
    })
    clientsUl.innerHTML = clientsHtml;
  })

  socket.on('message-from-server', (payload:{ fullName: string; message: string }) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${payload.fullName}:</strong> <span>${payload.message}</span>`;
    messagesUl?.append(li);
  })

  messageForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageInput?.value.trim().length <= 0) {
      return;
    }

    socket.emit('message-from-client',{ id: 'YO!', message: messageInput.value});

    messageInput.value = '';
  })
}