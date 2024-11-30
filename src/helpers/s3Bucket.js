import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const uploadToS3 = async (file, folder) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Ensure the bucket name is correct
    Key: `${folder}/${Date.now()}-${file.originalname}`, // Unique file name
    Body: file.buffer, // File content
    ContentType: file.mimetype, // Correct MIME type
  };

  try {
    const { Location } = await s3.upload(params).promise(); // Returns the file URL
    return Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
