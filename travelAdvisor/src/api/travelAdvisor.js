import axios from 'axios'

const travelAdvisorClient = axios.create({
  baseURL: 'https://travel-advisor.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
  },
})

const weatherClient = axios.create({
  baseURL: 'https://community-open-weather-map.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
  },
})

const withRapidApiKey = (headers = {}) => {
  const travelKey = import.meta.env.VITE_RAPID_API_TRAVEL_API_KEY
  const weatherKey = import.meta.env.VITE_RAPID_API_WEATHER_API_KEY

  console.log(' API Keys check:')
  console.log(' Travel API Key:', travelKey ? 'Present' : 'Missing')
  console.log(' Weather API Key:', weatherKey ? 'Present' : 'Missing')

  return {
    travelHeaders: {
      ...headers,
      'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      'x-rapidapi-key': travelKey ?? '',
    },
    weatherHeaders: {
      ...headers,
      'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
      'x-rapidapi-key': weatherKey ?? '',
    },
  }
}

export const getPlacesData = async (type, sw, ne) => {
  console.log(' API: Fetching places data...')
  console.log(' API: Type:', type)
  console.log(' API: SW bounds:', sw)
  console.log(' API: NE bounds:', ne)
  
  try {
    const { travelHeaders } = withRapidApiKey()
    const apiKey = travelHeaders['x-rapidapi-key']
    console.log(' API: API Key present:', !!apiKey)
    console.log(' API: API Key length:', apiKey?.length || 0)
    console.log(' API: API Key preview:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Missing')
    
    if (!apiKey) {
      console.error(' Missing RapidAPI Travel Advisor key (VITE_RAPID_API_TRAVEL_API_KEY).')
      console.error(' Please check your .env file and restart the dev server.')
      return []
    }
    
    console.log(' API: Request headers:', {
      'x-rapidapi-host': travelHeaders['x-rapidapi-host'],
      'x-rapidapi-key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Missing'
    })

    const params = {
      bl_latitude: String(sw.lat),
      bl_longitude: String(sw.lng),
      tr_latitude: String(ne.lat),
      tr_longitude: String(ne.lng),
      limit: '30',
      currency: 'USD',
      lang: 'en_US',
      lunit: 'km',
      open_now: 'false',
      // Add restaurant-specific tag category params only when needed
      ...(type === 'restaurants'
        ? {
            restaurant_tagcategory_standalone: '10591',
            restaurant_tagcategory: '10591',
          }
        : {}),
    }
    
    console.log(' API: Request params:', params)
    console.log(' API: Request URL:', `/${type}/list-in-boundary`)

    const response = await travelAdvisorClient.get(`/${type}/list-in-boundary`, {
      params,
      headers: travelHeaders,
    })

    console.log(' API: Response status:', response.status)
    console.log(' API: Response data keys:', Object.keys(response.data || {}))
    console.log(' API: Places count:', response.data?.data?.length || 0)
    
    const places = response.data?.data ?? []
    console.log(' API: Returning', places.length, 'places')
    
    return places
  } catch (error) {
    const status = error.response?.status
    const errorData = error.response?.data
    
    console.error(' API: Unable to fetch places data')
    console.error(' API: Error message:', error.message)
    console.error(' API: Error response:', errorData)
    console.error(' API: Error status:', status)
    
    // Handle rate limiting (429 Too Many Requests)
    if (status === 429) {
      console.warn(' Rate limit exceeded. Please wait before making more requests.')
      console.warn(' You may need to upgrade your RapidAPI subscription or wait for quota reset.')
      
      // Return empty array to prevent UI errors, but log the issue clearly
      return []
    }
    
    // Handle other errors
    if (status === 403) {
      console.error(' Forbidden: Check your API key and subscription status')
    }
    
    console.error(' API: Full error:', error)
    return []
  }
}

export const getWeatherData = async (lat, lng) => {
  try {
    if (!lat || !lng) return null

    const { weatherHeaders } = withRapidApiKey()
    if (!weatherHeaders['x-rapidapi-key']) {
      console.warn('Missing RapidAPI Weather key (VITE_RAPID_API_WEATHER_API_KEY).')
      return null
    }

    const response = await weatherClient.get('/find', {
      params: { lat, lon: lng },
      headers: weatherHeaders,
    })

    return response.data ?? null
  } catch (error) {
    console.error('Unable to fetch weather data', error)
    return null
  }
}



