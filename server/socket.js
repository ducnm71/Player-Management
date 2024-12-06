let io;
let pendingResponses = new Map();
// Hàm để gán io từ bin/www
const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

// Hàm để emit sự kiện
const emitToClients = (event, data) => {
  if (io) {
    io.emit(event, data);
  } else {
    console.error('Socket.io is not initialized');
  }
};

const registerCardHandler = (io) => {
    io.on('connection', (socket) => {
        socket.on('registerCard', ({ confirmation, data }) => {
            const responsePromise = pendingResponses.get('registerCard');
            if (responsePromise) {
              if (confirmation === 'yes') {
                responsePromise.resolve(data);
              } else {
                responsePromise.reject(new Error('Card registration cancelled'));
              }
              pendingResponses.delete('registerCard');
            }
          });
      
          // Xử lý khi gia hạn thẻ
          socket.on('extendCard', ({ confirmation, data }) => {
            const responsePromise = pendingResponses.get('extendCard');
            if (responsePromise) {
              if (confirmation === 'yes') {
                responsePromise.resolve(data);
              } else {
                responsePromise.reject(new Error('Card extension cancelled'));
              }
              pendingResponses.delete('extendCard');
            }
          });
    });
  };


// Xuất các hàm
module.exports = { setSocketIo, emitToClients,  registerCardHandler, pendingResponses  };
