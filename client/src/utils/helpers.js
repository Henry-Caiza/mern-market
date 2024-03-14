export function createArrImages(listing) {
    let arrImgages = []
    for (let i = 0; i < listing.length; i++) {
        const image = {
            original: listing[i],
            thumbnail: listing[i],
            thumbnailClass: 'rounded-xl ',
        }
        arrImgages.push(image);
    }
    return arrImgages
}

export function createArrImagesHome(listing) {
    let arrImgages = []
    for (let i = 0; i < listing.length; i++) {
        const image = {
            original: listing[i].imageUrls[0],
            thumbnail: listing[i].imageUrls[0],
            thumbnailClass: 'rounded-xl ',
        }
        arrImgages.push(image);
    }
    return arrImgages
}