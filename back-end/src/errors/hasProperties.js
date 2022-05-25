function hasProperties(properties, request) {
          try {
        for(let i = 0; i < properties.length; i++){
          if (!Object.keys(request).includes(properties[i])) {
            return false
          }
        }
        return true;
      } catch (error) {
          console.log(error)
      }
    
  }
  
  module.exports = hasProperties;