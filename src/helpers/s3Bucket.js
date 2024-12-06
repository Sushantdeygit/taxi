import { S3Client } from "@aws-sdk/client-s3"; // Import the S3 client
import { Upload } from "@aws-sdk/lib-storage"; // Import the Upload class from lib-storage

// Create an S3 client instance
const s3 = new S3Client({
  region: process.env.AWS_REGION, // Your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS Secret Access Key
  },
});

// Function to upload file to S3
export const uploadToS3 = async (file, folder) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    Key: `${folder}/${Date.now()}-${file.originalname}`, // Generate a unique key for the file
    Body: file.buffer, // Use the buffer stored by Multer (no need for fs)
    ContentType: file.mimetype, // MIME type of the file
  };

  // Using the Upload API to handle larger or streamable files
  const upload = new Upload({
    client: s3,
    params: uploadParams,
    queueSize: 4, // Adjust based on concurrency
    partSize: 5 * 1024 * 1024, // Set part size for multipart upload, default is 5MB
  });

  try {
    // Wait for the upload to finish and return the file URL
    const data = await upload.done();
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
