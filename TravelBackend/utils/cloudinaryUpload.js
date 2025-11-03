import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (buffer, folder = 'travel-stories') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    // Convert buffer to stream
    const readableStream = Readable.from(buffer)
    readableStream.pipe(uploadStream)
  })
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL or public_id
 * @returns {Promise<Object>} Cloudinary delete result
 */
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    let publicId = imageUrl
    
    // If it's a full URL, extract public_id
    if (imageUrl.includes('cloudinary.com')) {
      // Extract public_id from URL like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const urlParts = imageUrl.split('/')
      const uploadIndex = urlParts.findIndex(part => part === 'upload')
      if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
        // Get everything after 'upload' (skip version if present)
        const afterUpload = urlParts.slice(uploadIndex + 1)
        // Remove version if it's a number
        if (/^\d+$/.test(afterUpload[0])) {
          afterUpload.shift()
        }
        publicId = afterUpload.join('/').replace(/\.[^/.]+$/, '') // Remove extension
      }
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    })

    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

/**
 * Check if URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com')
}


