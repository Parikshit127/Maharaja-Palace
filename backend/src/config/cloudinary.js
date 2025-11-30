import { v2 as cloudinary } from "cloudinary";
import { config } from "./env.js";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

// Log to verify configuration (remove in production)
if (config.nodeEnv === "development") {
  console.log("📸 Cloudinary Configuration:");
  console.log(
    "   Cloud Name:",
    config.cloudinaryCloudName ? "✓ Set" : "✗ Missing"
  );
  console.log("   API Key:", config.cloudinaryApiKey ? "✓ Set" : "✗ Missing");
  console.log(
    "   API Secret:",
    config.cloudinaryApiSecret ? "✓ Set" : "✗ Missing"
  );
}

export default cloudinary;
