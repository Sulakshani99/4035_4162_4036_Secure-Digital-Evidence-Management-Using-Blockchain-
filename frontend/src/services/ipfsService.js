import { create } from 'ipfs-http-client';

class IPFSService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize IPFS client
   */
  init() {
    try {
      // Using Infura IPFS gateway (you can use your own IPFS node)
      // For local IPFS node, use: { host: 'localhost', port: 5001, protocol: 'http' }
      
      // Option 1: Local IPFS node
      this.client = create({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
      });

      // Option 2: Infura IPFS (uncomment if using Infura)
      /*
      const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
      const projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;
      const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
      
      this.client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth
        }
      });
      */

      this.initialized = true;
      console.log('IPFS client initialized');
    } catch (error) {
      console.error('Error initializing IPFS:', error);
      this.initialized = false;
    }
  }

  /**
   * Upload file to IPFS
   */
  async uploadFile(file) {
    if (!this.initialized) {
      this.init();
    }

    try {
      // Convert file to buffer
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      // Upload to IPFS
      const result = await this.client.add(uint8Array, {
        progress: (prog) => console.log(`Upload progress: ${prog}`)
      });

      console.log('File uploaded to IPFS:', result.path);
      return result.path; // Returns IPFS hash
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS. Make sure IPFS daemon is running.');
    }
  }

  /**
   * Upload JSON data to IPFS
   */
  async uploadJSON(data) {
    if (!this.initialized) {
      this.init();
    }

    try {
      const jsonString = JSON.stringify(data);
      const buffer = Buffer.from(jsonString);

      const result = await this.client.add(buffer);
      console.log('JSON uploaded to IPFS:', result.path);
      return result.path;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  /**
   * Get file from IPFS
   */
  async getFile(hash) {
    if (!this.initialized) {
      this.init();
    }

    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      const data = Buffer.concat(chunks);
      return data;
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      throw error;
    }
  }

  /**
   * Get JSON from IPFS
   */
  async getJSON(hash) {
    if (!this.initialized) {
      this.init();
    }

    try {
      const data = await this.getFile(hash);
      const jsonString = data.toString();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error);
      throw error;
    }
  }

  /**
   * Get IPFS gateway URL
   */
  getGatewayURL(hash) {
    // Public IPFS gateways
    return `https://ipfs.io/ipfs/${hash}`;
    // Alternative: return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  /**
   * Pin file to ensure it stays on IPFS
   */
  async pinFile(hash) {
    if (!this.initialized) {
      this.init();
    }

    try {
      await this.client.pin.add(hash);
      console.log('File pinned:', hash);
      return true;
    } catch (error) {
      console.error('Error pinning file:', error);
      throw error;
    }
  }

  /**
   * Create metadata for evidence file
   */
  createMetadata(file, description, caseId) {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      description: description,
      caseId: caseId,
      uploadedAt: new Date().toISOString()
    };
  }

  /**
   * Simulated IPFS upload (for testing without IPFS node)
   */
  async simulateUpload(file) {
    // Generate a fake hash for testing
    const fakeHash = 'Qm' + Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    console.log('Simulated IPFS upload:', fakeHash);
    return fakeHash;
  }
}

export default new IPFSService();
