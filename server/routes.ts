import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const STRAPI_API_URL = 'http://44.201.141.60:1337/api';
const STRAPI_API_TOKEN = '6aad3898e81a76409ee4bb000c07e5d0c133876ad93a33803e19b1dbd6ecf5857348cb65640eb843b0bda496eb72bf9260d277458536eaa7615ef3ee756237fee7601a8ca82e702b34f6a1283beba1dff253afe466212e8db3e1d8ab74039e57c35986a4171e797c2b016519b4b47eab868dc91e3160f82c93fc396fa15be8fe';

async function fetchFromStrapi(url: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy for Strapi API to avoid CORS issues
  app.get('/api/products', async (req, res) => {
    try {
      const queryParams = req.url.includes('?') ? `&${req.url.split('?')[1]}` : '';
      const url = `${STRAPI_API_URL}/products?populate=*${queryParams}`;
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
