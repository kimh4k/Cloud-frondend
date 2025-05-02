import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy for Strapi API to avoid CORS issues
  app.get('/api/products', async (req, res) => {
    try {
      const response = await fetch('http://44.201.141.60:1337/api/products?populate=*' + 
        (req.query.filters ? `&${req.url.split('?')[1]}` : ''));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products from Strapi API',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
