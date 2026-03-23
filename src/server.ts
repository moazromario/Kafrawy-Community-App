// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import app from './app';
import { connectDB } from './config/db';

async function startServer() {
  // Connect to DB
  await connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Ride Request State (Moved from root server.ts)
  let activeRequests = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (role) => {
      socket.join(role);
      console.log(`Socket ${socket.id} joined as ${role}`);
    });

    socket.on('ride_request', (data) => {
      const requestId = `ride_${Date.now()}`;
      const requestData = {
        id: requestId,
        riderId: socket.id,
        pickup: data.pickup,
        destination: data.destination,
        status: 'searching',
        timestamp: Date.now()
      };

      activeRequests.set(requestId, requestData);
      console.log(`Broadcasting ride request ${requestId} to drivers`);
      io.to('driver').emit('new_ride_available', requestData);
      socket.emit('ride_searching', { requestId });
    });

    socket.on('accept_ride', (data) => {
      const { requestId } = data;
      const request = activeRequests.get(requestId);

      if (request && request.status === 'searching') {
        request.status = 'accepted';
        request.driverId = socket.id;
        activeRequests.set(requestId, request);

        console.log(`Ride ${requestId} accepted by driver ${socket.id}`);
        socket.emit('ride_confirmed', { requestId, role: 'driver' });

        io.to(request.riderId).emit('driver_found', {
          requestId,
          driver: {
            name: 'كابتن أحمد',
            rating: 4.9,
            car: 'هيونداي إلنترا',
            plate: 'أ ب ج 123',
            image: 'https://picsum.photos/seed/driver1/200'
          }
        });

        io.to('driver').emit('ride_cancelled_for_others', { requestId });
      } else {
        socket.emit('ride_already_taken', { requestId });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
