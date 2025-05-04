import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // Import your storage configuration if needed

const STRAPI_API_URL = 'https://api.dachyubagain.store';

async function fetchFromStrapi(url: string, retries = 3) {
  console.log(`Fetching from Strapi: ${url}`);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let timeoutId: NodeJS.Timeout | undefined;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Connection': 'keep-alive',
        },
        // Add keepalive to maintain connection
        keepalive: true,
      });
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Strapi response error: ${response.status} ${response.statusText}`, responseText);
        throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response format from Strapi');
      }
      
      return data;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`Request to Strapi timed out after 30 seconds (attempt ${attempt}/${retries})`);
        } else if (error.cause && typeof error.cause === 'object' && 'code' in error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.error(`Connection to Strapi timed out (attempt ${attempt}/${retries})`);
        } else {
          console.error(`Error in fetchFromStrapi (attempt ${attempt}/${retries}):`, error.message);
        }
      } else {
        console.error(`Unknown error in fetchFromStrapi (attempt ${attempt}/${retries}):`, error);
      }

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy for Strapi API to avoid CORS issues
  app.get('/api/products', async (req, res) => {
    try {
      const url = `${STRAPI_API_URL}/products?populate=*`; // Now uses HTTPS
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
      const url = `${STRAPI_API_URL}/products/${id}?populate=*`; // Correct URL format with ID
      const data = await fetchFromStrapi(url);
      
      // Find the product by id or documentId
      const product = data.data.find((p: any) => 
        p.id.toString() === id || p.documentId === id
      );
      
      if (!product) {
        console.error(`Product not found with id ${id}`);
        res.status(404).json({ 
          error: 'Product not found',
          message: `No product found with id ${id}`
        });
        return;
      }
      
      // Return the product in the same format as the API
      res.json({
        data: [product],
        meta: data.meta
      });
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
      const filePath = req.path.replace('/uploads', ''); // Remove '/uploads' from the path to avoid duplicate '/api/api'
      const response = await fetch(`https://api.dachyubagain.store/uploads${filePath}`);
      
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

  // Endpoint for creating orders
  app.post('/api/orders', async (req, res) => {
    try {
      // In a real-world scenario, you would save this order to a database
      // and possibly forward it to a payment processor or external system
      const { customerInfo, orderItems, totalAmount } = req.body;
      
      // Log the order information (this is just for demonstration)
      console.log('New order received:', {
        customer: customerInfo,
        items: orderItems.map((item: any) => ({ 
          id: item.id, 
          title: item.title, 
          price: item.price,
          quantity: item.quantity 
        })),
        total: totalAmount,
        date: new Date().toISOString()
      });
      
      // Simulate processing time for the order
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Send success response
      res.status(201).json({ 
        success: true, 
        orderId: `ORD-${Date.now()}`,
        message: 'Order placed successfully' 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ 
        error: 'Failed to process order', 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
