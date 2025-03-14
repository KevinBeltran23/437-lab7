import { MongoClient } from "mongodb";

export interface UserDocument {
  _id: string;
  username: string;
  email: string;
}

export interface ImageDocument {
  _id: string;
  src: string;
  name: string;
  author?: string | {
    _id: string;
    username: string;
  };
  likes: number;
}

export class ImageProvider {
  constructor(private readonly mongoClient: MongoClient) {}
 
  async getAllImages(authorId?: string): Promise<ImageDocument[]> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;
    if (!collectionName) {
      throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
    }
   
    const collection = this.mongoClient.db().collection<ImageDocument>(collectionName);
    
    // Create filter object based on whether authorId is provided
    const filter = authorId ? { author: authorId } : {};
    
    // Use find() instead of aggregate()
    const images = await collection.find(filter).toArray();
    
    return images;
  }

  async updateImageName(imageId: string, newName: string): Promise<number> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;
    if (!collectionName) {
      throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
    }
    
    const collection = this.mongoClient.db().collection<ImageDocument>(collectionName);
    
    // Update the document with the specified id
    const result = await collection.updateOne(
      { _id: imageId },
      { $set: { name: newName } }
    );
    
    // Return the number of documents that matched the filter
    return result.matchedCount;
  }

  async createImage(imageData: ImageDocument): Promise<ImageDocument> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;
    if (!collectionName) {
        throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
    }
    
    const collection = this.mongoClient.db().collection<ImageDocument>(collectionName);
    
    // Insert the new image document
    await collection.insertOne(imageData);
    
    // Return the created document
    return imageData;
  }
}