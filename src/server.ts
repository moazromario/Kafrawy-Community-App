// src/server.ts
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import app from './app';
import { supabaseAdmin } from './lib/supabase-admin';

async function startServer() {
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

    socket.on('ride_request', async (data) => {
      const requestId = `ride_${Date.now()}`;
      const requestData: any = {
        id: requestId,
        riderId: socket.id,
        pickup: data.pickup,
        destination: data.destination,
        status: 'searching',
        timestamp: Date.now()
      };

      // Save to DB (Trip History)
      try {
        const tripData = {
          rider_id: socket.id,
          pickup: data.pickup,
          destination: data.destination,
          status: 'searching',
          created_at: new Date()
        };
        const { data: dbData, error } = await supabaseAdmin.from('trips').insert(tripData).select().single();
        if (error) throw error;
        requestData.dbId = dbData.id;
      } catch (err) {
        console.error('Error saving trip to DB:', err);
      }

      activeRequests.set(requestId, requestData);
      console.log(`Broadcasting ride request ${requestId} to drivers`);
      io.to('driver').emit('new_ride_available', requestData);
      socket.emit('ride_searching', { requestId });
    });

    socket.on('accept_ride', async (data) => {
      const { requestId } = data;
      const request = activeRequests.get(requestId);

      if (request && request.status === 'searching') {
        // Simulated Driver Ban Check (Rating < 4.0)
        // In a real app, we'd fetch the driver from DB using their auth UID
        const mockDriverRating = 4.9; // Demo rating
        if (mockDriverRating < 4.0) {
          socket.emit('driver_banned', { message: 'عذراً، تم حظر حسابك بسبب انخفاض التقييم.' });
          return;
        }

        request.status = 'accepted';
        request.driverId = socket.id;
        activeRequests.set(requestId, request);

        // Update DB
        if (request.dbId) {
        await supabaseAdmin.from('trips').update({
            driver_id: socket.id,
            status: 'accepted'
          }).eq('id', request.dbId);
        }

        console.log(`Ride ${requestId} accepted by driver ${socket.id}`);
        socket.emit('ride_confirmed', { requestId, role: 'driver' });

        io.to(request.riderId).emit('driver_found', {
          requestId,
          driver: {
            name: 'كابتن أحمد',
            rating: mockDriverRating,
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

    socket.on('trip_completed', async (data) => {
      const { requestId, fare } = data;
      const request = activeRequests.get(requestId);
      if (request) {
        request.status = 'completed';
        if (request.dbId) {
        await supabaseAdmin.from('trips').update({
            status: 'completed',
            price: fare,
            completed_at: new Date()
          }).eq('id', request.dbId);
        }
        io.to(request.riderId).emit('ride_completed', { fare });
        activeRequests.delete(requestId);
      }
    });

    socket.on('emergency_alert', (data) => {
      console.log('EMERGENCY ALERT RECEIVED:', data);
      // In a real app, this would notify an admin dashboard and authorities
      io.to('admin').emit('emergency_alert', {
        ...data,
        timestamp: new Date(),
        socketId: socket.id
      });
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
