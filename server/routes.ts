import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const STRAPI_API_URL = 'http://44.201.141.60:1337/api';

async function fetchFromStrapi(url: string) {
  console.log(`Fetching from Strapi: ${url}`);
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Strapi response error: ${response.status} ${response.statusText}`, responseText);
      throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchFromStrapi:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy for Strapi API to avoid CORS issues
  app.get('/api/products', async (req, res) => {
    try {
      // Direct approach - use the exact URL provided
      const url = 'http://44.201.141.60:1337/api/products?populate=*';
      const data = await fetchFromStrapi(url);
      res.json(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products from Strapi API',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Proxy for single product
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const url = `${STRAPI_API_URL}/products?populate=*&filters[id][$eq]=${id}`;
      const data = await fetchFromStrapi(url);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching product ${req.params.id}:`, error);
      res.status(500).json({ 
        error: 'Failed to fetch product from Strapi API',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Proxy for static media files from Strapi
  app.get('/uploads/*', async (req, res) => {
    try {
      const filePath = req.path;
      const response = await fetch(`http://44.201.141.60:1337${filePath}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      
      // Get the response body as buffer
      const buffer = await response.arrayBuffer();
      
      // Forward the content type and other relevant headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send the response
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json({ 
        error: 'Failed to fetch file from Strapi',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
