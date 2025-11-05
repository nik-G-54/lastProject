import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryUrl } from "../utils/cloudinaryUpload.js"

export const addTravelStory = async (req, res, next) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body

  const userId = req.user.id

  //   validate required field
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    })

    await travelStory.save()

    res.status(201).json({
      story: travelStory,
      message: "You story is added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTravelStory = async (req, res, next) => {
  const userId = req.user.id


  try {
    
    const travelStories = await TravelStory.find()
      .sort({ isFavorite: -1, createdAt: -1 }) // Favourites first, then newest
      
    res.status(200).json({ stories: travelStories })
  } catch (error) {
    next(error)
  }


}

export const getMyTravelStories = async (req, res, next) => {
  const userId = req.user.id

  try {
    const travelStories = await TravelStory.find({ userId })
      .sort({ isFavorite: -1, createdAt: -1 })

    res.status(200).json({ stories: travelStories })
  } catch (error) {
    next(error)
  }
}

export const imageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image uploaded"))
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer)

    res.status(201).json({ imageUrl: result.secure_url })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return next(errorHandler(500, "Failed to upload image to Cloudinary"))
  }
}

export const deleteImage = async (req, res, next) => {
  const { imageUrl } = req.query

  if (!imageUrl) {
    return next(errorHandler(400, "imageUrl parameter is required!"))
  }

  try {
    // Only delete from Cloudinary if it's a Cloudinary URL
    if (isCloudinaryUrl(imageUrl)) {
      await deleteFromCloudinary(imageUrl)
      res.status(200).json({ message: "Image deleted successfully from Cloudinary!" })
    } else {
      // If it's not a Cloudinary URL (e.g., placeholder), just return success
      res.status(200).json({ message: "Image URL processed (not a Cloudinary image)" })
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    return next(errorHandler(500, "Failed to delete image from Cloudinary"))
  }
}

export const editTravelStory = async (req, res, next) => {
  const { id } = req.params
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body
  const userId = req.user.id

  // validate required field
  if (!title || !story || !visitedLocation || !visitedDate) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel Story not found!"))
    }

    // Store old image URL before updating
    const oldImageUrl = travelStory.imageUrl
    const placeholderImageUrl = "/assets/placeholderImage.png";


    // Update travel story fields
    travelStory.title = title
    travelStory.story = story
    travelStory.visitedLocation = visitedLocation
    travelStory.imageUrl = imageUrl || placeholderImageUrl
    travelStory.visitedDate = parsedVisitedDate

    await travelStory.save()

    // Delete old image from Cloudinary if it's different and a Cloudinary URL
    if (oldImageUrl && oldImageUrl !== imageUrl && 
        oldImageUrl !== placeholderImageUrl && 
        isCloudinaryUrl(oldImageUrl)) {
      try {
        await deleteFromCloudinary(oldImageUrl)
        console.log("Old image deleted from Cloudinary:", oldImageUrl)
      } catch (error) {
        // Log error but don't fail the request if image deletion fails
        console.error("Error deleting old image from Cloudinary:", error)
      }
    }

    res.status(200).json({
      story: travelStory,
      message: "Travel story updated successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTravelStory = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel Story not found!"))
    }

    // Store imageUrl before deleting the story
    const imageUrl = travelStory.imageUrl

    // delete travel story from the database
    await travelStory.deleteOne({ _id: id, userId: userId })

    // Delete image from Cloudinary if it's a Cloudinary URL
    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`

    if (imageUrl && imageUrl !== placeholderImageUrl && isCloudinaryUrl(imageUrl)) {
      try {
        await deleteFromCloudinary(imageUrl)
      } catch (error) {
        // Log error but don't fail the request if image deletion fails
        console.error("Error deleting image from Cloudinary:", error)
      }
    }

    res.status(200).json({ message: "Travel story deleted successfully!" })
  } catch (error) {
    next(error)
  }
}

export const updateIsFavourite = async (req, res, next) => {
  const { id } = req.params
  const { isFavorite } = req.body
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel story not found!"))
    }

    travelStory.isFavorite = isFavorite

    await travelStory.save()

    res
      .status(200)
      .json({ story: travelStory, message: "Updated successfully!" })
  } catch (error) {
    next(error)
  }
}

export const searchTravelStory = async (req, res, next) => {
  const { query } = req.query
  const userId = req.user.id

  if (!query) {
    return next(errorHandler(404, "Query is required!"))
  }

  try {
    // Search in visitedLocation array - MongoDB automatically searches through array elements
    // For arrays of strings, regex will match any element that contains the query
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },   // this i make the search case insencitive 
        { story: { $regex: query, $options: "i" } },
        // Search in visitedLocation array - matches any location in the array
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavorite: -1 })

    res.status(200).json({
      stories: searchResults,
    })
  } catch (error) {
    next(error)
  }
}

export const filterTravelStories = async (req, res, next) => {
  const { startDate, endDate } = req.query
  const userId = req.user.id

  try {
    const start = new Date(parseInt(startDate))
    const end = new Date(parseInt(endDate))

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavorite: -1 })

    res.status(200).json({ stories: filteredStories })
  } catch (error) {
    next(error)
  }
}
