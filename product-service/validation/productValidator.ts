export const validateProductBody = (productStr: string | null) => {
    if(!productStr) {
        return true;
    }

    const product = JSON.parse(productStr);
    if(!product.title) {
        return true;
    }
    if(product.price && typeof product.price !== 'number') {
        return true;
    }
    return false;
}